import { FileX2 } from "lucide-react";
import { useEffect, useState } from "react";
import { loadPrompt } from "@/lib/prompt-cache";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { PromptKind } from "@/data/cases";

type PromptPanelProps = {
  promptUrl: string | null;
  promptKind: PromptKind | null;
  title: string;
};

/** Read-only body; all acquisition actions live in the detail's shared top toolbar. */
export const PromptPanel = ({ promptUrl, promptKind }: PromptPanelProps) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setPrompt(null);
    setFailed(false);
    if (promptUrl) void loadPrompt(promptUrl).then(text => {
      if (active) setPrompt(text);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [promptUrl, attempt]);

  if (promptUrl && prompt === null) {
    return <section className="min-h-32 space-y-3 rounded-lg border border-border bg-secondary/40 p-4" aria-busy={!failed}>
      <p role="status" className="text-sm text-muted-foreground">{failed ? t("common.error") : t("common.loading")}</p>
      {failed && <Button type="button" variant="secondary" onClick={() => setAttempt(value => value + 1)}>{t("common.retry")}</Button>}
    </section>;
  }
  if (!prompt) return <section aria-labelledby="prompt-heading" className="space-y-3">
    <h3 id="prompt-heading" className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">{t("detail.promptHeading")}</h3>
    <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-5">
      <p className="flex items-center gap-2 font-medium text-foreground"><FileX2 aria-hidden="true" className="h-4 w-4 text-muted-foreground" />{t("detail.promptUnavailableTitle")}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("detail.promptUnavailableBody")}</p>
    </div>
  </section>;
  return <section aria-labelledby="prompt-heading" className="space-y-3">
    <h3 id="prompt-heading" className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
      {promptKind === "original" ? t("detail.promptOriginalLabel") : t("detail.promptRecreationLabel")}
    </h3>
    <div className="max-h-72 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-4">
      <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">{prompt}</pre>
    </div>
    <p className="text-xs text-muted-foreground">{promptKind === "original" ? t("detail.promptOriginalNote") : t("detail.promptRecreationNote")}</p>
  </section>;
};
