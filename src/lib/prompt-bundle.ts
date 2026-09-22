import type { CaseEntry, PromptKind } from "@/data/cases";
import { pickLocalized } from "@/data/cases";
import { loadPromptBatch } from "@/lib/prompt-cache";

/** Minimal structural shape of i18next's `t`. */
export type PromptTranslate = (
  key: string,
  options?: Record<string, unknown>,
) => string;

const promptKindLabel = (kind: PromptKind | null, t: PromptTranslate) =>
  kind === "original"
    ? t("bundle.docOriginalKind")
    : t("bundle.docRecreationKind");

const fencedPrompt = (prompt: string) => {
  const longestRun = Math.max(0, ...Array.from(prompt.matchAll(/`+/g), (match) => match[0].length));
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return `${fence}text\n${prompt}\n${fence}`;
};

export const buildSinglePromptMarkdown = (
  title: string,
  prompt: string,
  promptKind: PromptKind | null,
  t: PromptTranslate,
): string =>
  [
    `# ${title}`,
    "",
    `**${t("bundle.docPromptKind")}:** ${promptKindLabel(promptKind, t)}`,
    "",
    `## ${t("detail.promptHeading")}`,
    "",
    fencedPrompt(prompt),
    "",
  ].join("\n");

/** Build a provenance-labelled Markdown bundle from the selected cases. */
export const buildPromptBundle = async (
  selectedCases: CaseEntry[],
  t: PromptTranslate,
  language: string,
  context: { title: string; total: number },
): Promise<string> => {
  const loaded = await loadPromptBatch(selectedCases.filter(entry => entry.promptUrl !== null));
  const entries = loaded.filter((entry): entry is CaseEntry & { prompt: string } => entry.prompt !== null);
  const lines: string[] = [];

  lines.push(`# ${context.title}`);
  lines.push("");
  lines.push(
    `> ${t("bundle.docSelectedSummary", {
      selected: entries.length,
      total: context.total,
    })}`,
  );
  lines.push("");

  entries.forEach((entry, position) => {
    lines.push(`## ${position + 1}. ${pickLocalized(entry.title, language)}`);
    lines.push("");
    lines.push(`- **${t("bundle.docCaseHeading")}:** <${entry.previewUrl}>`);
    lines.push(
      `- **${t("bundle.docPromptKind")}:** ${promptKindLabel(entry.promptKind, t)}`,
    );
    lines.push("");
    lines.push(`### ${t("detail.promptHeading")}`);
    lines.push("");
    lines.push(fencedPrompt(entry.prompt));
    lines.push("");
  });

  return lines.join("\n");
};
