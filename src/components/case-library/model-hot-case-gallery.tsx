import { LayoutGrid } from "lucide-react";
import { LibraryMore, LibraryPagination, useLibraryPage } from "./library-focus";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CaseDetailShell } from "@/components/case-library/case-detail-shell";
import { CasePhotoCard } from "@/components/case-library/case-photo-card";
import type { CaseEntry } from "@/data/cases";
import { getShowcaseCollectionCases, type ShowcaseCollection } from "@/data/showcase-collections";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import "@/styles/case-photogrid.css";

/** Case membership belongs to each collection, never to a shared model-page default. */
export function ModelHotCaseGallery({ collection, focused, onFocus }: { collection: ShowcaseCollection; focused: boolean; onFocus: () => void }) {
  const { t } = useTranslation();
  const entries = getShowcaseCollectionCases(collection);
  const paging = useLibraryPage(entries.length, focused);
  const displayed = entries.slice(paging.start, paging.start + paging.size);
  const [activeDetail, setActiveDetail] = useState<{ entry: CaseEntry; origin: CaseFlipOrigin } | null>(null);
  const openDetails = useCallback((entry: CaseEntry, origin: CaseFlipOrigin) => {
    setActiveDetail(current => current ?? { entry, origin });
  }, []);
  const closeDetails = useCallback(() => { setActiveDetail(null); onFocus(); }, [onFocus]);

  if (entries.length === 0) return <div className="model-collection-empty" role="status"><LayoutGrid size={26} strokeWidth={1.25} aria-hidden="true" /><p>{t("modelPages.casesEmpty")}</p></div>;

  return <>
    <div className="model-hot-grid">
      {displayed.map((entry, index) => (
        <CasePhotoCard
          key={entry.id}
          entry={entry}
          index={paging.start + index + 1}
          selectionMode={false}
          selected={false}
          onSelectedChange={() => undefined}
          onOpenDetails={openDetails}
        />
      ))}
    </div>
    {paging.more && <LibraryMore onClick={() => { paging.expand(); onFocus(); }} />}
    {!paging.more && <LibraryPagination current={paging.current} pages={paging.pages} onChange={next => { paging.changePage(next); document.getElementById("cases-heading")?.scrollIntoView({ block: "start" }); }} />}
    {activeDetail && <CaseDetailShell
      key={activeDetail.entry.id}
      entry={activeDetail.entry}
      origin={activeDetail.origin}
      onClosed={closeDetails}
    />}
  </>;
}
