import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pattern } from "./types";

interface RegistryState {
  patterns: Pattern[];
  addPattern: (p: Pattern) => void;
  updatePattern: (id: string, partial: Partial<Pattern>) => void;
  removePattern: (id: string) => void;
  setAll: (patterns: Pattern[]) => void;
  nextId: () => string;
}

export const useRegistry = create<RegistryState>()(
  persist(
    (set, get) => ({
      patterns: [],
      addPattern: (p) => set((s) => ({ patterns: [p, ...s.patterns] })),
      updatePattern: (id, partial) =>
        set((s) => ({
          patterns: s.patterns.map((p) => (p.id === id ? { ...p, ...partial } : p)),
        })),
      removePattern: (id) => set((s) => ({ patterns: s.patterns.filter((p) => p.id !== id) })),
      setAll: (patterns) => set({ patterns }),
      nextId: () => {
        const max = get().patterns.reduce((m, p) => {
          const n = parseInt(p.id.replace(/[^0-9]/g, ""), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 0);
        return `P-${String(max + 1).padStart(3, "0")}`;
      },
    }),
    { name: "learn-mentor-registry" }
  )
);
