import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LLMSettings, ProviderId } from "./types";

export interface ProfileKey {
  id: string;
  label: string;
}

export const PROFILES: ProfileKey[] = [
  { id: "elementary", label: "小学" },
  { id: "middle", label: "初中" },
  { id: "high", label: "高中" },
  { id: "college", label: "大学" },
  { id: "self", label: "自学" },
  { id: "competition", label: "竞赛" },
];

export const PROVIDER_PRESETS: Record<
  Exclude<ProviderId, "custom">,
  { label: string; baseURL: string; model: string }
> = {
  deepseek: { label: "DeepSeek", baseURL: "https://api.deepseek.com/v1", model: "deepseek-chat" },
  openai: { label: "OpenAI", baseURL: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  anthropic: { label: "Claude (Anthropic)", baseURL: "https://api.anthropic.com/v1", model: "claude-3-5-sonnet-latest" },
  qwen: { label: "通义千问", baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-plus" },
};

interface SettingsState {
  llm: LLMSettings;
  profile: string;
  setProfile: (p: string) => void;
  setLLM: (partial: Partial<LLMSettings>) => void;
  applyPreset: (provider: ProviderId) => void;
}

const defaultSettings: LLMSettings = {
  provider: "deepseek",
  apiKey: "",
  baseURL: PROVIDER_PRESETS.deepseek.baseURL,
  model: PROVIDER_PRESETS.deepseek.model,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      llm: defaultSettings,
      profile: "middle",
      setProfile: (profile) => set({ profile }),
      setLLM: (partial) => set((s) => ({ llm: { ...s.llm, ...partial } })),
      applyPreset: (provider) =>
        set((s) => {
          if (provider === "custom") return { llm: { ...s.llm, provider } };
          const p = PROVIDER_PRESETS[provider];
          return { llm: { ...s.llm, provider, baseURL: p.baseURL, model: p.model } };
        }),
    }),
    { name: "learn-mentor-settings" }
  )
);
