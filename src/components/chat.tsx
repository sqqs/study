"use client";

import { useEffect, useRef, useState } from "react";
import { useMentorChat } from "@/lib/use-mentor-chat";
import { useSettings } from "@/lib/settings-store";
import { Markdown } from "./markdown";
import { Sparkles, Send, KeyRound, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PendingImage = { id: string; name?: string; contentType?: string; url: string };

function MessageItem({ m }: { m: any }) {
  const isUser = m.role === "user";
  const attachments = m.experimental_attachments as PendingImage[] | undefined;
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
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((a, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={a.url}
                alt={a.name || "题目图片"}
                className="rounded-xl border border-white/40 max-h-48 object-contain bg-white/40"
              />
            ))}
          </div>
        )}
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const noKey = !llm.apiKey;
  const streaming = status === "streaming" || status === "submitted";

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<PendingImage>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id:
                  (crypto.randomUUID?.() as string) || String(Date.now() + Math.random()),
                name: file.name,
                contentType: file.type,
                url: reader.result as string,
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((imgs) => setPendingImages((prev) => [...prev, ...imgs]));
  };

  const removeImage = (id: string) =>
    setPendingImages((prev) => prev.filter((p) => p.id !== id));

  const submit = () => {
    if (noKey) {
      onOpenSettings();
      return;
    }
    if (!input.trim() && pendingImages.length === 0) return;
    handleSubmit(undefined, {
      experimental_attachments: pendingImages,
      allowEmptySubmit: pendingImages.length > 0,
    } as any);
    setPendingImages([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="mx-auto max-w-2xl mt-10 text-center">
            <div className="glass rounded-3xl p-8 animate-fade-in">
              <Sparkles className="mx-auto mb-3 text-brand" size={32} />
              <h2 className="text-2xl font-semibold text-ink">我是你的学习导师</h2>
              <p className="text-ink-soft mt-2">
                把题目发给我，我会一步步引导你自己解出来，并把好方法沉淀进学习飞轮。也可以直接上传或粘贴题目图片。
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
          submit();
        }}
        className="p-4"
      >
        {pendingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {pendingImages.map((img) => (
              <div key={img.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name || "待发送图片"}
                  className="h-20 w-20 object-cover rounded-xl border border-white/40"
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 grid place-items-center w-5 h-5 rounded-full bg-ink/70 text-white text-xs hover:bg-ink transition cursor-pointer"
                  aria-label="移除图片"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="glass rounded-2xl flex items-end gap-2 p-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={streaming}
            className="shrink-0 grid place-items-center w-10 h-10 rounded-xl text-ink-soft hover:bg-white/40 hover:text-brand transition cursor-pointer disabled:opacity-40"
            aria-label="上传题目图片"
            title="上传题目图片"
          >
            <ImagePlus size={20} />
          </button>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={noKey ? "请先在设置里填写 API Key" : "输入题目，或描述你的思路…（可粘贴/上传图片）"}
            className="flex-1 bg-transparent resize-none outline-none px-3 py-2 max-h-40 text-[15px] leading-relaxed"
            rows={1}
            onPaste={(e) => {
              const files = e.clipboardData?.files;
              if (files && files.length > 0) {
                const hasImage = Array.from(files).some((f) => f.type.startsWith("image/"));
                if (hasImage) {
                  e.preventDefault();
                  addFiles(files);
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
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
