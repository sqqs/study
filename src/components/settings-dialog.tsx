"use client";

import { useState } from "react";
import { useSettings, PROVIDER_PRESETS } from "@/lib/settings-store";
import type { ProviderId } from "@/lib/types";
import { X, KeyRound, Check } from "lucide-react";

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const llm = useSettings((s) => s.llm);
  const setLLM = useSettings((s) => s.setLLM);
  const applyPreset = useSettings((s) => s.applyPreset);
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const providers: { id: ProviderId; label: string }[] = [
    { id: "deepseek", label: PROVIDER_PRESETS.deepseek.label },
    { id: "openai", label: PROVIDER_PRESETS.openai.label },
    { id: "anthropic", label: PROVIDER_PRESETS.anthropic.label },
    { id: "qwen", label: PROVIDER_PRESETS.qwen.label },
    { id: "custom", label: "自定义" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-3xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-soft hover:text-ink cursor-pointer"
          aria-label="关闭"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <KeyRound size={18} className="text-brand" />
          <h2 className="text-lg font-semibold text-ink">模型设置</h2>
        </div>
        <p className="text-xs text-ink-soft mb-5">
          API Key 仅保存在你自己的浏览器，仅本次请求发送给后端代理，不会上传到任何服务器。
        </p>

        <label className="block text-sm text-ink-soft mb-1.5">模型提供方</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={
                "px-3 py-2 rounded-xl text-sm border transition cursor-pointer " +
                (llm.provider === p.id
                  ? "bg-brand text-white border-brand"
                  : "bg-white/50 border-white/50 text-ink-soft hover:bg-white/70")
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="block text-sm text-ink-soft mb-1.5">API Key</label>
        <input
          type="password"
          value={llm.apiKey}
          onChange={(e) => setLLM({ apiKey: e.target.value })}
          placeholder="sk-..."
          className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand text-sm mb-4"
        />

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-sm text-ink-soft mb-1.5">Base URL</label>
            <input
              value={llm.baseURL}
              onChange={(e) => setLLM({ baseURL: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1.5">模型名</label>
            <input
              value={llm.model}
              onChange={(e) => setLLM({ model: e.target.value })}
              placeholder="deepseek-chat"
              className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
            onClose();
          }}
          className="w-full rounded-xl bg-brand text-white py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
        >
          {saved ? <Check size={16} /> : null}
          {saved ? "已保存" : "保存设置"}
        </button>
      </div>
    </div>
  );
}
