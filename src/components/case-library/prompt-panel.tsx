import { Copy, Download, FileX2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PromptKind } from "@/data/cases";
import { buildSinglePromptMarkdown } from "@/lib/prompt-bundle";
import { copyText, downloadTextFile, sanitizeFilename } from "@/lib/prompt-file";

type PromptPanelProps = {
  /** Exact prompt text, or null when no prompt is available. */
  prompt: string | null;
  promptKind: PromptKind | null;
  /** Display title, used only to build the download filename. */
  title: string;
};

export const PromptPanel = ({ prompt, promptKind, title }: PromptPanelProps) => {
  const { t } = useTranslation();

  const handleCopy = async () => {
    if (!prompt) return;
    const ok = await copyText(prompt);
    if (ok) {
      toast.success(t("common.copied"));
    } else {
      toast.error(t("common.copyFailed"));
    }
  };

  const handleDownload = () => {
    if (!prompt) return;
    const markdown = buildSinglePromptMarkdown(title, prompt, promptKind, t);
    const ok = downloadTextFile(`${sanitizeFilename(title)}-prompt.md`, markdown);
    if (ok) {
      toast.success(t("common.downloadStarted"));
    } else {
      toast.error(t("common.downloadFailed"));
    }
  };

  if (!prompt) {
    return (
      <section aria-labelledby="prompt-heading" className="space-y-3">
        <h3
          id="prompt-heading"
          className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground"
        >
          {t("detail.promptHeading")}
        </h3>

        <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-5">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <FileX2 aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            {t("detail.promptUnavailableTitle")}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("detail.promptUnavailableBody")}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled>
              <Copy aria-hidden="true" />
              {t("common.copy")}
            </Button>
            <Button type="button" variant="secondary" disabled>
              <Download aria-hidden="true" />
              {t("common.download")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="prompt-heading" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id="prompt-heading"
          className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground"
        >
          {promptKind === "original"
            ? t("detail.promptOriginalLabel")
            : t("detail.promptRecreationLabel")}
        </h3>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={handleCopy}>
            <Copy aria-hidden="true" />
            {t("common.copy")}
          </Button>
          <Button type="button" variant="secondary" onClick={handleDownload}>
            <Download aria-hidden="true" />
            {t("common.download")}
          </Button>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-4">
        {/* whitespace-pre-wrap preserves the newlines of the original prompt. */}
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">
          {prompt}
        </pre>
      </div>

      <p className="text-xs text-muted-foreground">
        {promptKind === "original"
          ? t("detail.promptOriginalNote")
          : t("detail.promptRecreationNote")}
      </p>
    </section>
  );
};
