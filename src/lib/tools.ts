"use client";

import { patternSchema } from "./pattern-schema";
import { useRegistry } from "./registry-store";
import type { Pattern } from "./types";

// 客户端执行：模型在对话中调用 savePattern 时，由浏览器写入本地飞轮。
export async function executeSavePattern(args: unknown): Promise<{ ok: boolean; id: string }> {
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
}
