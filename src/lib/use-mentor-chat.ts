"use client";

import { useChat } from "@ai-sdk/react";
import { streamText, convertToCoreMessages } from "ai";
import { getModel } from "./ai";
import { buildSystemPrompt } from "./prompt";
import { savePatternTool } from "./tools";
import { useSettings } from "./settings-store";
import { useRegistry } from "./registry-store";

// 纯客户端 fetch：浏览器内直接调用大模型（无服务端代理）。
// 通过 useChat 的 fetch 选项拦截请求，改用 streamText 直连用户配置的模型，
// 并返回数据流响应（useChat 原生消费）。Key 始终只存在于用户浏览器。
async function clientChatFetch(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const raw = (init?.body as string | undefined) ?? "{}";
  const body = JSON.parse(raw) as { messages: any[] };
  const { llm, profile } = useSettings.getState();
  const patterns = useRegistry.getState().patterns;

  const result = streamText({
    model: getModel(llm),
    system: buildSystemPrompt({ registry: patterns, profile }),
    messages: convertToCoreMessages(body.messages),
    tools: { savePattern: savePatternTool },
    maxSteps: 6,
    abortSignal: init?.signal ?? undefined,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) =>
      error instanceof Error ? error.message : "请求出错，请检查 API Key 与模型是否支持。",
  });
}

// 封装 useChat：所有对话在浏览器内完成，导师提示词与飞轮上下文在此注入。
export function useMentorChat() {
  return useChat({
    api: "/api/chat", // 占位路径；实际由 clientChatFetch 在浏览器内直连大模型
    fetch: clientChatFetch,
  });
}
