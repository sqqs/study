import { streamText, convertToCoreMessages } from "ai";
import { getModel } from "@/lib/ai";
import { patternSchema } from "@/lib/pattern-schema";
import { buildSystemPrompt } from "@/lib/prompt";
import type { LLMSettings } from "@/lib/types";

export const maxDuration = 60;

interface ChatBody {
  messages: unknown[];
  llmSettings: LLMSettings;
  registry: unknown[];
  profile: string;
}

export async function POST(req: Request) {
  let body: ChatBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid-body" }), { status: 400 });
  }

  const { messages, llmSettings, registry, profile } = body;

  if (!llmSettings?.apiKey) {
    return new Response(
      JSON.stringify({ error: "missing-key", message: "请先在设置中填写 API Key" }),
      { status: 400 }
    );
  }

  let model;
  try {
    model = getModel(llmSettings);
  } catch (e) {
    console.error("model init failed", e);
    return new Response(JSON.stringify({ error: "model-init" }), { status: 500 });
  }

  const system = buildSystemPrompt({
    // registry 只作为上下文注入，无需完整对象
    registry: (registry as any[])?.map((r) => ({ ...r, content: {} })) ?? [],
    profile: profile || "middle",
  });

  const result = streamText({
    model,
    system,
    messages: convertToCoreMessages(messages as any),
    tools: {
      savePattern: {
        description:
          "当学生完成学习并通过复盘、掌握了一个可复用的方法或避坑经验时，调用本工具把它沉淀到「学习飞轮」。",
        parameters: patternSchema,
      },
    },
    onError: ({ error }) => {
      console.error("stream error", error);
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage: (e) =>
      e instanceof Error ? e.message : "调用大模型失败，请检查 Key / 模型 / 网络",
  });
}
