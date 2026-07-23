"use client";

import { patternSchema } from "./pattern-schema";
import { useRegistry } from "./registry-store";
import type { Pattern } from "./types";

// 浏览器端工具：模型在对话中调用 savePattern 时，由本工具直接在浏览器写入本地「学习飞轮」。
// 因为 Key 与调用都在浏览器，无需任何服务端。
// 不显式标注 Tool 类型，交给 streamText 的 tools 参数做上下文类型推断（避免引入未导出的类型）。
export const savePatternTool = {
  description:
    "当学生在对话中展现出值得长期记住的解题经验、有效思路、或明确的错因（不再重复的错）时，调用此工具把它沉淀为一条「学习飞轮」模式。",
  parameters: patternSchema,
  execute: async (args: unknown) => {
    const data = patternSchema.parse(args);
    const registry = useRegistry.getState();
    const id = registry.nextId();
    const pattern: Pattern = {
      id,
      category: data.category,
      title: data.title,
      subject: data.subject || "通用",
      problemType: data.problemType || "",
      content: data.content || {},
      tags: data.tags || [],
      mastery: data.mastery || "consolidated",
      createdAt: new Date().toISOString().slice(0, 10),
      source: data.source,
    };
    registry.addPattern(pattern);
    return { ok: true, id };
  },
};
