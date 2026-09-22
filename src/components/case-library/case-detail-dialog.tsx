import { ArrowUpRight, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PromptPanel } from "./prompt-panel";
import { Button } from "@/components/ui/button";
import type { CaseEntry } from "@/data/cases";
import { pickCaseTitle } from "@/hooks/use-case-filters";
import { useCurrentLanguage } from "@/hooks/use-current-language";

/** Noncritical actions and prompt body, mounted only after the flip settles. */
export const CaseDetailDialog = ({ entry }: { entry: CaseEntry }) => {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
      <Button asChild><a href={entry.previewUrl} target="_blank" rel="noopener noreferrer">{t("card.preview")}<ArrowUpRight aria-hidden="true" /></a></Button>
      {entry.remixUrl ? <Button asChild variant="secondary"><a href={entry.remixUrl} target="_blank" rel="noopener noreferrer">Remix<ArrowUpRight aria-hidden="true" /></a></Button> : <>
        <span aria-disabled="true" className="inline-flex h-11 cursor-not-allowed select-none items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 text-sm font-medium text-muted-foreground opacity-70"><Lock aria-hidden="true" className="h-4 w-4" />{t("card.remixComingSoon")}</span>
        <span className="text-xs text-muted-foreground">{t("card.remixUnavailable")}</span>
      </>}
    </div>
    <div className="border-t border-border pt-5"><PromptPanel key={entry.id} promptUrl={entry.promptUrl} promptKind={entry.promptKind} title={pickCaseTitle(entry, language)} /></div>
  </div>;
};
