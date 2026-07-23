"use client";

import type { Pattern, PatternCategory, Mastery } from "@/lib/types";
import { cn } from "@/lib/utils";

const CAT_LABEL: Record<PatternCategory, string> = {
  "effective-approach": "有效思路",
  mistake: "避坑经验",
  transferable: "可迁移方法",
};

const MASTERY_DOT: Record<Mastery, string> = {
  learning: "bg-amber-500",
  consolidated: "bg-brand",
  mastered: "bg-emerald-500",
};

const MASTERY_LABEL: Record<Mastery, string> = {
  learning: "学习中",
  consolidated: "已巩固",
  mastered: "已掌握",
};

export function PatternList({
  patterns,
  query,
  onQuery,
  category,
  onCategory,
  onEdit,
  onDelete,
}: {
  patterns: Pattern[];
  query: string;
  onQuery: (v: string) => void;
  category: PatternCategory | "all";
  onCategory: (v: PatternCategory | "all") => void;
  onEdit: (p: Pattern) => void;
  onDelete: (id: string) => void;
}) {
  const cats: (PatternCategory | "all")[] = [
    "all",
    "effective-approach",
    "mistake",
    "transferable",
  ];

  const filtered = patterns.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.problemType.toLowerCase().includes(q) ||
      p.tags.join(" ").toLowerCase().includes(q);
    const matchC = category === "all" || p.category === category;
    return matchQ && matchC;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="搜索模式、题型或标签…"
          className="flex-1 rounded-xl bg-white/70 border border-white/60 px-4 py-2.5 outline-none focus:border-brand text-sm"
        />
        <div className="flex gap-1.5 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer",
                category === c
                  ? "bg-brand text-white border-brand"
                  : "bg-white/50 border-white/50 text-ink-soft hover:bg-white/70"
              )}
            >
              {c === "all" ? "全部" : CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-ink-soft text-sm">
          还没有匹配的模式。在导师对话里掌握方法后，会自动沉淀到这里。
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="glass rounded-2xl p-4 hover:-translate-y-0.5 hover:shadow-glass-lg transition cursor-pointer group"
              onClick={() => onEdit(p)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink-soft">{p.id}</span>
                <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <span className={cn("w-2 h-2 rounded-full", MASTERY_DOT[p.mastery])} />
                  {MASTERY_LABEL[p.mastery]}
                </span>
              </div>
              <h3 className="font-semibold text-ink mb-1 leading-snug">{p.title}</h3>
              <p className="text-xs text-ink-soft mb-2">{CAT_LABEL[p.category]}</p>
              {p.problemType && (
                <p className="text-xs text-ink-soft line-clamp-2 mb-2">{p.problemType}</p>
              )}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-black/5 text-ink-soft rounded-full px-2 py-0.5"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(p);
                  }}
                  className="text-xs text-brand hover:underline"
                >
                  编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.id);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
