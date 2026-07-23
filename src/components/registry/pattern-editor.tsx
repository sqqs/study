"use client";

import { useEffect, useState } from "react";
import type { Pattern, PatternCategory, Mastery } from "@/lib/types";
import { X } from "lucide-react";

const CATS: { id: PatternCategory; label: string }[] = [
  { id: "effective-approach", label: "有效思路" },
  { id: "mistake", label: "避坑经验" },
  { id: "transferable", label: "可迁移方法" },
];

const MASTERIES: { id: Mastery; label: string }[] = [
  { id: "learning", label: "学习中" },
  { id: "consolidated", label: "已巩固" },
  { id: "mastered", label: "已掌握" },
];

export function PatternEditor({
  pattern,
  onClose,
  onSave,
}: {
  pattern: Pattern;
  onClose: () => void;
  onSave: (p: Pattern) => void;
}) {
  const [draft, setDraft] = useState<Pattern>(pattern);

  useEffect(() => setDraft(pattern), [pattern]);

  const setContent = (key: string, value: string) =>
    setDraft((d) => ({ ...d, content: { ...d.content, [key]: value } }));

  const removeContentKey = (key: string) =>
    setDraft((d) => {
      const next = { ...d.content };
      delete next[key];
      return { ...d, content: next };
    });

  const addContentKey = () =>
    setDraft((d) => ({ ...d, content: { ...d.content, "新字段": "" } }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="glass-strong rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-ink-soft hover:text-ink cursor-pointer"
          aria-label="关闭"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-ink mb-4">编辑模式</h2>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-ink-soft mb-1">标题</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink-soft mb-1">学科</label>
              <input
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-ink-soft mb-1">掌握度</label>
              <select
                value={draft.mastery}
                onChange={(e) => setDraft({ ...draft, mastery: e.target.value as Mastery })}
                className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand"
              >
                {MASTERIES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-ink-soft mb-1">题型特征</label>
            <input
              value={draft.problemType}
              onChange={(e) => setDraft({ ...draft, problemType: e.target.value })}
              className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-ink-soft mb-1">类型</label>
            <div className="flex gap-2">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setDraft({ ...draft, category: c.id })}
                  className={
                    "px-3 py-1.5 rounded-xl text-xs border transition cursor-pointer " +
                    (draft.category === c.id
                      ? "bg-brand text-white border-brand"
                      : "bg-white/50 border-white/50 text-ink-soft")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-ink-soft mb-1">标签（逗号分隔）</label>
            <input
              value={draft.tags.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-xl bg-white/70 border border-white/60 px-3 py-2 outline-none focus:border-brand"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-ink-soft">结构化内容</label>
              <button
                onClick={addContentKey}
                className="text-xs text-brand hover:underline cursor-pointer"
              >
                + 添加字段
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(draft.content).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <input
                    value={k}
                    onChange={(e) => {
                      const nv = e.target.value;
                      setDraft((d) => {
                        const next = { ...d.content };
                        delete next[k];
                        next[nv] = v;
                        return { ...d, content: next };
                      });
                    }}
                    className="w-28 shrink-0 rounded-xl bg-white/70 border border-white/60 px-2 py-1.5 outline-none focus:border-brand text-xs"
                  />
                  <input
                    value={v}
                    onChange={(e) => setContent(k, e.target.value)}
                    className="flex-1 rounded-xl bg-white/70 border border-white/60 px-2 py-1.5 outline-none focus:border-brand text-xs"
                  />
                  <button
                    onClick={() => removeContentKey(k)}
                    className="text-red-500 text-xs px-1 cursor-pointer"
                  >
                    删
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSave(draft)}
          className="w-full mt-5 rounded-xl bg-brand text-white py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer"
        >
          保存
        </button>
      </div>
    </div>
  );
}
