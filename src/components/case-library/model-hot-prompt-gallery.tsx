import { useCallback, useState } from "react";
import { CaseDetailShell } from "@/components/case-library/case-detail-shell";
import { CasePhotoCard } from "@/components/case-library/case-photo-card";
import { cases, type CaseEntry } from "@/data/cases";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import "@/styles/case-photogrid.css";

/** Curated from the six published examples shown at the top of the existing case gallery. */
const FEATURED_IDS = new Set([
  "d6b40daaf4ea4ba88b2a5aa5d3f4c6d8",
  "8913089c9e184d1aad4b0310a5b7fb96",
  "ac436982c25144eb83faf94a06cb904a",
  "a2a3b1836aac46d1bb5d3d09715848db",
  "674a7f6546ea4ff5a2c6fd7394aa5a2b",
  "b84a5c72086842a7ab8c77b6fa935f01",
]);
const featuredCases = cases.filter(entry => FEATURED_IDS.has(entry.id));

export function ModelHotPromptGallery() {
  const [activeDetail, setActiveDetail] = useState<{ entry: CaseEntry; origin: CaseFlipOrigin } | null>(null);
  const openDetails = useCallback((entry: CaseEntry, origin: CaseFlipOrigin) => {
    setActiveDetail(current => current ?? { entry, origin });
  }, []);
  const closeDetails = useCallback(() => setActiveDetail(null), []);

  return <>
    <div className="model-hot-grid">
      {featuredCases.map((entry, index) => (
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
