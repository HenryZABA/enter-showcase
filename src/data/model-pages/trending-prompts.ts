import type { Localized } from "@/data/cases";

/** Editorial entries are added only with source attribution and the verbatim original. */
export type TrendingPrompt = {
  id: string;
  title: Localized;
  description: Localized;
  sourceName: string;
  sourceUrl: string;
  promptUrl: string;
  mediaUrl?: string;
  kind: "original";
};

/** No externally sourced prompts have been supplied for these collections yet. */
export const trendingPromptsByModel: Record<string, readonly TrendingPrompt[]> = {
  "gpt-6-astra": [],
  "gpt-6-sol-luna": [],
  "claude-opus-5-5": [],
};
