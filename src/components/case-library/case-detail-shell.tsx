import { useEffect, useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { CaseFlipTransition } from "./case-flip-transition";
import { loadCaseDetail } from "./detail-loader";
import { LiveFrame } from "./live-frame";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { caseGalleryImage } from "@/data/case-gallery";
import type { CaseEntry } from "@/data/cases";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { pickCaseDescription, pickCaseTitle } from "@/hooks/use-case-filters";
import { useCurrentLanguage } from "@/hooks/use-current-language";

function DetailBody({ entry }: { entry: CaseEntry }) {
  const { t } = useTranslation();
  const [Body, setBody] = useState<ComponentType<{ entry: CaseEntry }> | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void loadCaseDetail().then(module => {
      if (!cancelled) setBody(() => module.CaseDetailDialog);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, []);
  if (Body) return <Body entry={entry} />;
  return <p role="status" className="min-h-11 text-sm text-muted-foreground">{failed ? t("common.error") : t("common.loading")}</p>;
}

/** First click never awaits code; only the noncritical detail body is split. */
export function CaseDetailShell({ entry, origin, onClosed }: {
  entry: CaseEntry; origin: CaseFlipOrigin; onClosed: () => void;
}) {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const title = pickCaseTitle(entry, language);
  const categoryLabel = entry.category === "interactive3d" ? t("category.interactive3d")
    : entry.category === "business" ? t("category.business") : t("category.creative");
  return (
    <CaseFlipTransition origin={origin} onClosed={onClosed} closeLabel={t("common.close")}>
      {(settled) => <>
        <DialogHeader className="pr-10 text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{categoryLabel}</p>
          <DialogTitle className="font-display text-2xl font-medium">{title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">{pickCaseDescription(entry, language)}</DialogDescription>
        </DialogHeader>
        <section className="space-y-3">
          <h3 className="font-display text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">{t("detail.previewHeading")}</h3>
          <LiveFrame url={entry.previewUrl} title={title} poster={entry.gallery?.imageUrl || caseGalleryImage(entry.id)} enabled={settled} />
        </section>
        {settled && <DetailBody entry={entry} />}
      </>}
    </CaseFlipTransition>
  );
}
