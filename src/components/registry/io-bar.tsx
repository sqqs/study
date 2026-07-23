"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { Pattern } from "@/lib/types";
import { patternsToMarkdown, markdownToPatterns } from "@/lib/markdown";
import { Download, Upload, FileDown, FileUp, Check } from "lucide-react";

export function IOBar({
  patterns,
  onImport,
}: {
  patterns: Pattern[];
  onImport: (p: Pattern[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Pattern[] | null>(null);

  const exportMd = () => {
    const md = patternsToMarkdown(patterns);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "LEARNING_REGISTRY.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const parsed = markdownToPatterns(text);
      if (parsed.length === 0) {
        alert("未能解析出任何模式，请检查 Markdown 格式。");
        return;
      }
      setPreview(parsed);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportMd}
        className="inline-flex items-center gap-2 rounded-xl bg-white/60 border border-white/50 px-4 py-2 text-sm text-ink hover:bg-white/80 transition cursor-pointer"
      >
        <Download size={16} /> 导出 Markdown
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl bg-white/60 border border-white/50 px-4 py-2 text-sm text-ink hover:bg-white/80 transition cursor-pointer"
      >
        <Upload size={16} /> 导入 Markdown
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        className="hidden"
        onChange={onFile}
      />

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileUp size={18} className="text-brand" />
              <h3 className="font-semibold text-ink">导入预览</h3>
            </div>
            <p className="text-sm text-ink-soft mb-4">
              将导入 <b className="text-ink">{preview.length}</b> 条模式，替换当前飞轮内容。
            </p>
            <ul className="max-h-48 overflow-y-auto space-y-1 mb-5 text-sm">
              {preview.map((p) => (
                <li key={p.id} className="text-ink-soft">
                  {p.id} · {p.title}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button
                onClick={() => setPreview(null)}
                className="flex-1 rounded-xl bg-white/60 border border-white/50 py-2.5 text-sm hover:bg-white/80 transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onImport(preview);
                  setPreview(null);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-white py-2.5 text-sm font-medium hover:opacity-90 transition cursor-pointer"
              >
                <Check size={16} /> 确认导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
