import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { pickLocalized } from "@/data/cases";
import type { TrendingPrompt } from "@/data/model-pages/trending-prompts";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { CaseFlipTransition } from "./case-flip-transition";
import { DownloadPromptButton } from "./download-prompt-button";

type PanelProps = { promptUrl: string; promptKind: "original"; title: string };
let pending: Promise<typeof import("./prompt-panel")> | undefined;
const loadPanel = () => pending ??= import("./prompt-panel").catch((error: unknown) => {
  pending = undefined;
  throw error;
});

function PromptDetailBody({ entry, title }: { entry: TrendingPrompt; title: string }) {
  const { t } = useTranslation();
  const [Panel, setPanel] = useState<ComponentType<PanelProps> | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    void loadPanel().then(module => {
      if (active) setPanel(() => module.PromptPanel);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (Panel) return <Panel promptUrl={entry.promptUrl} promptKind="original" title={title} />;
  return <div className="min-h-32 space-y-3" aria-busy={!failed}>
    <p role="status" className="text-sm text-muted-foreground">{failed ? t("common.error") : t("common.loading")}</p>
    {failed && <Button type="button" variant="secondary" onClick={() => setAttempt(value => value + 1)}>{t("common.retry")}</Button>}
  </div>;
}

export function PromptDetailShell({ entry, origin, onClosed }: { entry: TrendingPrompt; origin: CaseFlipOrigin; onClosed: () => void }) {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const title = pickLocalized(entry.title, language);
  return <CaseFlipTransition origin={origin} onClosed={onClosed} closeLabel={t("common.close")}>
    {settled => <>
      <DialogHeader className="pr-10 text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("modelPages.originalPrompts")}</p>
        <DialogTitle className="font-display text-2xl font-medium">{title}</DialogTitle>
        <DialogDescription className="text-base leading-relaxed text-muted-foreground">{pickLocalized(entry.description, language)}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="model-trending-source">{t("modelPages.source")} <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.sourceName}<ArrowUpRight size={13} aria-hidden="true" /></a></p>
        <DownloadPromptButton title={title} promptUrl={entry.promptUrl} promptKind="original" />
      </div>
      {settled && <PromptDetailBody entry={entry} title={title} />}
    </>}
  </CaseFlipTransition>;
}
