"use client";

import { PROFILES, useSettings } from "@/lib/settings-store";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSelector() {
  const profile = useSettings((s) => s.profile);
  const setProfile = useSettings((s) => s.setProfile);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <GraduationCap size={16} className="text-ink-soft shrink-0" />
      <div className="flex gap-1.5 flex-wrap">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfile(p.id)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer border",
              profile === p.id
                ? "bg-brand text-white border-brand"
                : "bg-white/50 text-ink-soft border-white/50 hover:bg-white/70"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
