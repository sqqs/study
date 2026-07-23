"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BookHeart, Settings, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { useRegistry } from "@/lib/registry-store";
import { cn } from "@/lib/utils";

export function Sidebar({
  collapsed,
  onToggle,
  onOpenSettings,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
}) {
  const pathname = usePathname();
  const count = useRegistry((s) => s.patterns.length);

  const item = (active: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition cursor-pointer",
      active ? "bg-white/70 text-ink font-medium shadow-sm" : "text-ink-soft hover:bg-white/50"
    );

  return (
    <aside
      className={cn(
        "shrink-0 h-full glass-strong flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-white/40">
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-brand text-white shrink-0">
          <Sparkles size={18} />
        </div>
        {!collapsed && <span className="font-semibold text-ink">学习导师</span>}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <button className={item(false)} onClick={onToggle} title="收起/展开">
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>收起</span>}
        </button>

        <Link href="/" className={item(pathname === "/")}>
          <Sparkles size={18} />
          {!collapsed && <span>导师对话</span>}
        </Link>

        <Link href="/registry" className={item(pathname === "/registry")}>
          <BookHeart size={18} />
          {!collapsed && (
            <span className="flex-1">学习飞轮</span>
          )}
          {!collapsed && count > 0 && (
            <span className="text-xs bg-brand/10 text-brand rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </Link>

        <button className={item(false)} onClick={onOpenSettings}>
          <Settings size={18} />
          {!collapsed && <span>设置</span>}
        </button>
      </nav>

      {!collapsed && (
        <div className="p-3 text-[11px] text-ink-soft border-t border-white/40">
          数据仅存于本机浏览器
        </div>
      )}
    </aside>
  );
}

export function NewChatButton({ collapsed }: { collapsed: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-xl bg-brand text-white px-3 py-2 text-sm font-medium hover:opacity-90 transition cursor-pointer",
        collapsed && "justify-center"
      )}
      onClick={() => location.reload()}
      title="新对话"
    >
      <Plus size={16} />
      {!collapsed && <span>新对话</span>}
    </button>
  );
}
