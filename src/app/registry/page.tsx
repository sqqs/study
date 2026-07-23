"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { PatternList } from "@/components/registry/pattern-list";
import { PatternEditor } from "@/components/registry/pattern-editor";
import { IOBar } from "@/components/registry/io-bar";
import { useRegistry } from "@/lib/registry-store";
import type { Pattern } from "@/lib/types";
import { BookHeart } from "lucide-react";

export default function RegistryPage() {
  const [collapsed, setCollapsed] = useState(false);
  const patterns = useRegistry((s) => s.patterns);
  const updatePattern = useRegistry((s) => s.updatePattern);
  const removePattern = useRegistry((s) => s.removePattern);
  const setAll = useRegistry((s) => s.setAll);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Pattern["category"] | "all">("all");
  const [editing, setEditing] = useState<Pattern | null>(null);

  const mistakeTop = patterns
    .filter((p) => p.category === "mistake")
    .slice(0, 3);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onOpenSettings={() => {}} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <BookHeart size={22} className="text-brand" />
            <h1 className="text-2xl font-semibold text-ink">学习飞轮</h1>
          </div>
          <p className="text-sm text-ink-soft">
            你真正掌握的方法与避坑经验，都沉淀在这里，下次遇到同类题导师会自动提醒。
          </p>
        </header>

        <div className="px-6 grid gap-3 sm:grid-cols-3 mb-5">
          <div className="glass rounded-2xl p-4">
            <div className="text-2xl font-semibold text-ink">{patterns.length}</div>
            <div className="text-xs text-ink-soft">已掌握模式</div>
          </div>
          <div className="glass rounded-2xl p-4 sm:col-span-2">
            <div className="text-xs text-ink-soft mb-1">高频避坑 TOP</div>
            {mistakeTop.length === 0 ? (
              <div className="text-sm text-ink-soft">暂无避坑记录</div>
            ) : (
              <div className="flex flex-col gap-1">
                {mistakeTop.map((m) => (
                  <div key={m.id} className="text-sm text-ink truncate">
                    {m.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex justify-end mb-4">
            <IOBar patterns={patterns} onImport={(p) => setAll(p)} />
          </div>
          <PatternList
            patterns={patterns}
            query={query}
            onQuery={setQuery}
            category={category}
            onCategory={setCategory}
            onEdit={setEditing}
            onDelete={removePattern}
          />
        </div>
      </main>

      {editing && (
        <PatternEditor
          pattern={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            updatePattern(p.id, p);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
