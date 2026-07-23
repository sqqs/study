"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Chat } from "@/components/chat";
import { ProfileSelector } from "@/components/profile-selector";
import { SettingsDialog } from "@/components/settings-dialog";
import { Settings } from "lucide-react";

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 glass border-b border-white/40 flex items-center justify-between px-5 gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-ink truncate">导师对话</h1>
            <p className="text-xs text-ink-soft truncate">引导你思考，而不是替你作答</p>
          </div>
          <div className="flex items-center gap-4">
            <ProfileSelector />
            <button
              onClick={() => setSettingsOpen(true)}
              className="grid place-items-center w-9 h-9 rounded-xl bg-white/60 border border-white/50 text-ink-soft hover:text-ink transition cursor-pointer"
              aria-label="设置"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0">
          <Chat onOpenSettings={() => setSettingsOpen(true)} />
        </div>
      </main>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
