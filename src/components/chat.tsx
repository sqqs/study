"use client";

import { useEffect, useRef } from "react";
import { useMentorChat } from "@/lib/use-mentor-chat";
import { useSettings } from "@/lib/settings-store";
import { Markdown } from "./markdown";
import { Sparkles, Send, KeyRound, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function MessageItem({ m }: { m: any }) {
  const isUser = m.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 animate-fade-in",
          isUser
            ? "bg-brand/10 border border-brand/20"
            : "glass"
        )}
      >
        {m.parts?.map((part: any, i: number) => {
          if (part.type === "text") return <Markdown key={i} content={part.text} />;
          if (part.type === "tool-invocation") {
            const ti = part.toolInvocation;
            if (ti?.toolName === "savePattern") {
              const done = ti.state === "result";
              return (
                <div
                  key={i}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1"
                >
                  {done ? "✅ 已沉淀到学习飞轮" : "⏳ 正在沉淀经验…"}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );
}

export function Chat({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, status, error } = useMentorChat();
  const llm = useSettings((s) => s.llm);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const noKey = !llm.apiKey;
  const streaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="mx-auto max-w-2xl mt-10 text-center">
            <div className="glass rounded-3xl p-8 animate-fade-in">
              <Sparkles className="mx-auto mb-3 text-brand" size={32} />
              <h2 className="text-2xl font-semibold text-ink">我是你的学习导师</h2>
              <p className="text-ink-soft mt-2">
                把题目发给我，我会一步步引导你自己解出来，并把好方法沉淀进学习飞轮。
              </p>
              {noKey && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
                >
                  <KeyRound size={16} /> 先填写 API Key
                </button>
              )}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageItem key={m.id} m={m} />
        ))}

        {streaming && (
          <div className="flex items-center gap-2 text-ink-soft text-sm pl-2">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
            导师思考中
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!noKey && input.trim()) handleSubmit();
          else if (noKey) onOpenSettings();
        }}
        className="p-4"
      >
        <div className="glass rounded-2xl flex items-end gap-2 p-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={noKey ? "请先在设置里填写 API Key" : "输入题目，或描述你的思路…"}
            className="flex-1 bg-transparent resize-none outline-none px-3 py-2 max-h-40 text-[15px] leading-relaxed"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!noKey && input.trim()) handleSubmit();
                else if (noKey) onOpenSettings();
              }
            }}
          />
          <button
            type="submit"
            disabled={streaming || noKey}
            className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-brand text-white hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
            aria-label="发送"
          >
            {streaming ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-2 px-2">
            出错了：{error.message || "请检查 API Key 与网络"}
          </p>
        )}
      </form>
    </div>
  );
}
