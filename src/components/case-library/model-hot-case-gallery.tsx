import { LayoutGrid } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CaseDetailShell } from "@/components/case-library/case-detail-shell";
import { CasePhotoCard } from "@/components/case-library/case-photo-card";
import type { CaseEntry } from "@/data/cases";
import { getShowcaseCollectionCases, type ShowcaseCollection } from "@/data/showcase-collections";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import "@/styles/case-photogrid.css";

/** Case membership belongs to each collection, never to a shared model-page default. */
export function ModelHotCaseGallery({ collection }: { collection: ShowcaseCollection }) {
  const { t } = useTranslation();
  const entries = getShowcaseCollectionCases(collection).slice(0, 6);
  const [activeDetail, setActiveDetail] = useState<{ entry: CaseEntry; origin: CaseFlipOrigin } | null>(null);
  const openDetails = useCallback((entry: CaseEntry, origin: CaseFlipOrigin) => {
    setActiveDetail(current => current ?? { entry, origin });
  }, []);
  const closeDetails = useCallback(() => setActiveDetail(null), []);

  if (entries.length === 0) return <div className="model-collection-empty" role="status"><LayoutGrid size={26} strokeWidth={1.25} aria-hidden="true" /><p>{t("modelPages.casesEmpty")}</p></div>;

  return <>
    <div className="model-hot-grid">
      {entries.map((entry, index) => (
        <CasePhotoCard
          key={entry.id}
          entry={entry}
          index={index + 1}
          selectionMode={false}
          selected={false}
          onSelectedChange={() => undefined}
          onOpenDetails={openDetails}
        />
      ))}
    </div>
    {activeDetail && <CaseDetailShell
      key={activeDetail.entry.id}
      entry={activeDetail.entry}
      origin={activeDetail.origin}
      onClosed={closeDetails}
    />}
  </>;
}
