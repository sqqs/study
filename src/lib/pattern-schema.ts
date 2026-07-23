import { z } from "zod";

// 同时被服务端（声明工具供模型调用）与客户端（解析参数）复用
export const patternSchema = z.object({
  category: z
    .enum(["effective-approach", "mistake", "transferable"])
    .describe("沉淀类型：有效思路 / 避坑经验 / 可迁移方法"),
  title: z.string().describe("模式名称，如「双约束代数式求范围」"),
  subject: z.string().describe("学科，如 数学 / 物理"),
  problemType: z.string().describe("题型特征描述，便于日后检索同类题"),
  content: z
    .record(z.string())
    .describe("结构化内容，键如 规则/步骤/易错/纠正/验证，值为说明文本"),
  tags: z.array(z.string()).optional().describe("标签，便于筛选"),
  mastery: z
    .enum(["learning", "consolidated", "mastered"])
    .optional()
    .describe("掌握度，默认已巩固"),
  source: z.string().optional().describe("题源或出处"),
});

export type PatternInput = z.infer<typeof patternSchema>;
