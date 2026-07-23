export type PatternCategory = "effective-approach" | "mistake" | "transferable";

export type Mastery = "learning" | "consolidated" | "mastered";

export interface Pattern {
  id: string;
  category: PatternCategory;
  title: string;
  subject: string;
  problemType: string;
  content: Record<string, string>;
  tags: string[];
  mastery: Mastery;
  createdAt: string;
  source?: string;
}

export type ProviderId = "deepseek" | "openai" | "anthropic" | "qwen" | "custom";

export interface LLMSettings {
  provider: ProviderId;
  apiKey: string;
  baseURL: string;
  model: string;
}
