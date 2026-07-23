"use client";

import { useChat } from "@ai-sdk/react";
import { executeSavePattern } from "./tools";
import { useSettings } from "./settings-store";
import { useRegistry } from "./registry-store";

// 封装 useChat：附带用户 LLM 设置、飞轮摘要与 Profile；用 onToolCall 在浏览器端执行 savePattern。
export function useMentorChat() {
  const profile = useSettings((s) => s.profile);
  const llm = useSettings((s) => s.llm);
  const patterns = useRegistry((s) => s.patterns);

  return useChat({
    api: "/api/chat",
    maxSteps: 3,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === "savePattern") {
        return executeSavePattern(toolCall.args);
      }
    },
    experimental_prepareRequestBody: ({ messages }) => ({
      messages,
      llmSettings: llm,
      registry: patterns.map((p) => ({
        id: p.id,
        category: p.category,
        title: p.title,
        problemType: p.problemType,
        tags: p.tags,
      })),
      profile,
    }),
  });
}
