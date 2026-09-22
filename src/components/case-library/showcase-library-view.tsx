import { ArrowDown, ArrowLeft, ChevronRight, Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CaseDetailShell } from "@/components/case-library/case-detail-shell";
import { Link } from "react-router-dom";
import "@/styles/showcase.css";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CaseCard } from "@/components/case-library/case-card";
import { CasePhotoCard } from "@/components/case-library/case-photo-card";
import "@/styles/case-photogrid.css";
import { CollectionCarousel } from "@/components/case-library/collection-carousel";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { FilterBar } from "@/components/case-library/filter-bar";
import { HeroStage } from "@/components/case-library/hero-stage";
import { PromptDownloadSuccessDialog } from "@/components/case-library/prompt-download-success-dialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LiquidButton, LiquidLink } from "@/components/ui/liquid-glass-button";
import type { CaseEntry } from "@/data/cases";
import type { ShowcaseHeroContent } from "@/data/showcase-collections";
import { useCaseFilters } from "@/hooks/use-case-filters";
import { useAppHref } from "@/hooks/use-app-href";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { buildPromptBundle } from "@/lib/prompt-bundle";
import { downloadTextFile } from "@/lib/prompt-file";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";

type ShowcaseLibraryViewProps = {
  entries: CaseEntry[];
  layout: "catalog" | "collection";
  documentTitle: string;
  heading: string;
  hero: ShowcaseHeroContent;
  collectionHref?: string;
  bundleTitle: string;
  downloadFileName: string;
};

export const ShowcaseLibraryView = ({
  entries, layout, documentTitle, heading, hero, collectionHref, bundleTitle, downloadFileName,
}: ShowcaseLibraryViewProps) => {
  const isCollection = layout === "collection";
  const indexById = useMemo(() => new Map(entries.map((entry, position) => [entry.id, position + 1])), [entries]);
  const availablePrompts = useMemo(() => entries.filter(entry => entry.prompt !== null), [entries]);
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const appHref = useAppHref();
  const collectionsHref = `${appHref("/showcases/collections")}?${new URLSearchParams({ hl: language })}`;
  useShowcaseTheme(documentTitle);

  const {
    query,
    setQuery,
    category,
    setCategory,
    filteredCases,
    categoryCounts,
  } = useCaseFilters(entries);

  const [expanded, setExpanded] = useState(false);
  const [activeDetail, setActiveDetail] = useState<{
    entry: CaseEntry;
    origin: CaseFlipOrigin;
  } | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [downloadSuccessOpen, setDownloadSuccessOpen] = useState(false);
  const [downloadedPromptCount, setDownloadedPromptCount] = useState(0);
  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(
    new Set(),
  );

  const openDetails = (entry: CaseEntry, origin: CaseFlipOrigin) => {
    if (!activeDetail) setActiveDetail({ entry, origin });
  };
  const closeDetails = useCallback(() => setActiveDetail(null), []);

  const toggleSelectionMode = () => {
    setSelectionMode((current) => {
      const next = !current;
      if (!isCollection) setExpanded(next);
      return next;
    });
    setSelectedPromptIds(new Set());
  };

  const setPromptSelected = (id: string, selected: boolean) => {
    setSelectedPromptIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const downloadPrompts = (selectedEntries: CaseEntry[], fileName: string) => {
    const content = buildPromptBundle(selectedEntries, t, language, { title: bundleTitle, total: entries.length });
    const ok = downloadTextFile(fileName, content);
    if (ok) {
      setDownloadedPromptCount(selectedEntries.length);
      setDownloadSuccessOpen(true);
    } else {
      toast.error(t("bundle.failed"));
    }
  };

  const selectedPrompts = availablePrompts.filter((entry) =>
    selectedPromptIds.has(entry.id),
  );

  useEffect(() => {
    setExpanded(false);
  }, [query, category]);

  const totalFilteredCases = filteredCases.length;
  const visibleLimit = isCollection || expanded ? totalFilteredCases : 9;
  const displayedCases = filteredCases.slice(0, visibleLimit);
  const canExploreMore = !isCollection && !expanded && totalFilteredCases > 9;
  const showCollections = !isCollection;
  const GalleryCard = isCollection ? CaseCard : CasePhotoCard;

  return (
    <div className="showcase flex min-h-screen flex-col">
      <Header showSearch={false} />

      <main className="flex-1">
        {isCollection && (
          <div className="container pt-5">
            <LiquidLink to={collectionsHref} size="lg">
              <ArrowLeft aria-hidden="true" />
              {t("collections.backToCollections")}
            </LiquidLink>
          </div>
        )}
        <div className={showCollections ? "showcase-hero-ensemble" : undefined}>
          <HeroStage content={hero} collectionHref={collectionHref} blended={showCollections} />

          {showCollections && (
            <section aria-label={t("collections.sectionTitle")} className="showcase-hero-collections">
              <div className="container relative">
                <Link
                  to={collectionsHref}
                  className="collection-view-all inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("youcases.viewAll")}
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <CollectionCarousel paused={activeDetail !== null} />
              </div>
            </section>
          )}
        </div>

        <section
          id="cases"
          aria-labelledby="cases-heading"
          className="ambient-section scroll-mt-16 py-12 lg:py-16"
        >
          <div className="container">
            <div className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="block h-px w-8 bg-primary" />
                <h2
                  id="cases-heading"
                  className="font-display text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl"
                >
                  {heading}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <LiquidButton
                  type="button"
                  size="sm"
                  flowingBorder
                  onClick={toggleSelectionMode}
                  aria-pressed={selectionMode}
                >
                  <Download aria-hidden="true" />
                  {t("bundle.buttonWithCount", { value: availablePrompts.length })}
                </LiquidButton>
                {selectionMode && <LiquidButton
                  type="button"
                  size="sm"
                  flowingBorder
                  disabled={selectedPrompts.length === 0}
                  onClick={() =>
                    downloadPrompts(
                      selectedPrompts,
                      downloadFileName,
                    )
                  }
                >
                  <Download aria-hidden="true" />
                  {t("bundle.downloadSelectedCount", {
                    value: selectedPrompts.length,
                  })}
                </LiquidButton>}
              </div>
            </div>

          <FilterBar
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            categoryCounts={categoryCounts}
          />

          {displayedCases.length > 0 && (
            <div className={isCollection ? "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "case-photogrid"}>
              {displayedCases.map((entry) => (
                <GalleryCard
                  key={entry.id}
                  entry={entry}
                  index={indexById.get(entry.id) ?? 1}
                  selectionMode={selectionMode}
                  selected={selectedPromptIds.has(entry.id)}
                  onSelectedChange={(selected) =>
                    setPromptSelected(entry.id, selected)
                  }
                  onOpenDetails={openDetails}
                />
              ))}
            </div>
          )}

          {canExploreMore && (
            <div className="mt-10 flex justify-center">
              <LiquidButton
                type="button"
                size="lg"
                onClick={() => setExpanded(true)}
              >
                {t("gallery.exploreMore")}
                <ArrowDown aria-hidden="true" />
              </LiquidButton>
            </div>
          )}

          {filteredCases.length === 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-lg font-medium text-foreground">{t("gallery.emptyTitle")}</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t("gallery.emptyBody")}</p>
            </div>
          )}

          </div>
        </section>
      </main>

      <Footer />

      <PromptDownloadSuccessDialog
        open={downloadSuccessOpen}
        onOpenChange={setDownloadSuccessOpen}
        count={downloadedPromptCount}
      />

      {activeDetail && (
        <CaseDetailShell
          key={activeDetail.entry.id}
          entry={activeDetail.entry}
          origin={activeDetail.origin}
          onClosed={closeDetails}
        />
      )}
    </div>
  );
};
