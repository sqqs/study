import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";
import type { LLMSettings } from "./types";

// 依据用户选择构建模型。除 Claude 外，其余 OpenAI 兼容接口统一走 createOpenAI。
export function getModel(settings: LLMSettings): LanguageModel {
  const { provider, apiKey, baseURL, model } = settings;

  if (provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey, baseURL: baseURL || undefined });
    return anthropic(model);
  }

  const openai = createOpenAI({
    apiKey,
    baseURL: baseURL || undefined,
    compatibility: "compatible",
  });
  return openai(model);
}
