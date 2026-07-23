"use client";

import { useChat } from "@ai-sdk/react";
import {
  streamText,
  convertToCoreMessages,
  createDataStreamResponse,
  type Message,
} from "ai";
import { getModel } from "./ai";
import { buildSystemPrompt } from "./prompt";
import { savePatternTool } from "./tools";
import { useSettings } from "./settings-store";
import { useRegistry } from "./registry-store";

// 判断消息组中是否含有图片附件（用户通过图片按钮 / 粘贴发送）。
function messagesHaveImage(messages: Message[]): boolean {
  return (
    Array.isArray(messages) &&
    messages.some(
      (m) =>
        Array.isArray((m as any).experimental_attachments) &&
        (m as any).experimental_attachments.length > 0
    )
  );
}

// 粗略判断模型是否具备视觉（图片理解）能力，仅用于「提前提示」，
// 真正是否支持仍以 API 返回为准（见下方 getErrorMessage 兜底）。
// 这里只拦截「明确不支持视觉」的模型，其余放行交给 API 决定，避免误伤可发图的模型。
function isVisionModel(model: string): boolean {
  const m = (model || "").toLowerCase();
  // 常见视觉模型关键词：直接放行
  const visionHints = [
    "vision",
    "vl",
    "gpt-4o",
    "gpt-4-vision",
    "qwen-vl",
    "qwen2-vl",
    "qwen2.5-vl",
    "gemini",
    "claude-3",
    "claude-opus",
    "claude-sonnet",
    "doubao-vision",
    "glm-4v",
    "deepseek-vl",
    "deepseek-v4",
    "yi-vl",
    "moondream",
    "llava",
  ];
  if (visionHints.some((h) => m.includes(h))) return true;
  // 明确纯文本、不支持视觉的模型：拦截并提示
  // （deepseek-chat / deepseek-reasoner 为纯文本模型，且官方将于 2026-07-24 弃用）
  const textOnly = [
    "deepseek-chat",
    "deepseek-reasoner",
    "reasoner",
    "embedding",
    "text-embedding",
    "gpt-3.5",
    "qwen-turbo",
    "qwen-plus",
    "qwen-max",
    "qwen-long",
  ];
  if (textOnly.some((h) => m.includes(h))) return false;
  // 未知模型：保守放行，让 API 决定（失败再由 getErrorMessage 兜底提示）
  return true;
}

// 生成「当前模型不支持图片」的中文友好提示，动态带上模型名，避免笼统否定厂商。
function visionHint(model?: string): string {
  const name = model ? `「${model}」` : "";
  return `当前模型${name}不支持图片输入（或该端点不接受图片）。请到「设置」把模型换成支持视觉的模型，例如 DeepSeek 的 deepseek-v4-flash / OpenAI gpt-4o / 通义千问 qwen-vl 等，再发送图片。纯文本题目直接输入文字即可。`;
}

// 纯客户端 fetch：浏览器内直接调用大模型（无服务端代理）。
// 通过 useChat 的 fetch 选项拦截请求，改用 streamText 直连用户配置的模型，
// 并返回数据流响应（useChat 原生消费）。Key 始终只存在于用户浏览器。
async function clientChatFetch(
  _input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const raw = (init?.body as string | undefined) ?? "{}";
  let body: { messages: Message[] };
  try {
    body = JSON.parse(raw) as { messages: Message[] };
  } catch {
    body = { messages: [] };
  }
  const { llm, profile } = useSettings.getState();
  const patterns = useRegistry.getState().patterns;

  // 含图片但模型不支持视觉：提前友好提示，避免无效请求与晦涩的服务端报错
  if (messagesHaveImage(body.messages) && !isVisionModel(llm.model)) {
    return createDataStreamResponse({
      execute: () => {
        throw new Error(visionHint(llm.model));
      },
      onError: (error) => (error instanceof Error ? error.message : "未知错误"),
    });
  }

  const result = streamText({
    model: getModel(llm),
    system: buildSystemPrompt({ registry: patterns, profile }),
    messages: convertToCoreMessages(body.messages),
    tools: { savePattern: savePatternTool },
    maxSteps: 6,
    abortSignal: init?.signal ?? undefined,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      // 任何与图片 / 视觉 / 多模态相关的报错，都转成中文指引
      if (/image_url|unknown variant|image|vision|multimodal|图片/i.test(msg)) {
        return visionHint(llm.model);
      }
      return error instanceof Error
        ? error.message
        : "请求出错，请检查 API Key 与模型是否支持。";
    },
  });
}

// 封装 useChat：所有对话在浏览器内完成，导师提示词与飞轮上下文在此注入。
export function useMentorChat() {
  return useChat({
    api: "/api/chat", // 占位路径；实际由 clientChatFetch 在浏览器内直连大模型
    fetch: clientChatFetch,
  });
}
