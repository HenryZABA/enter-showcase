import { ArrowUpRight, Lock } from "lucide-react";
import { memo, useRef, type MouseEvent } from "react";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { useTranslation } from "react-i18next";

import { CardLivePreview } from "@/components/case-library/card-live-preview";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { CaseEntry } from "@/data/cases";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { pickCaseDescription, pickCaseTitle } from "@/hooks/use-case-filters";

export type CaseCardProps = {
  entry: CaseEntry;
  index: number;
  selectionMode: boolean;
  selected: boolean;
  onSelectedChange: (id: string, selected: boolean) => void;
  onOpenDetails: (entry: CaseEntry, origin: CaseFlipOrigin) => void;
};

export const CaseCard = memo(function CaseCard({
  entry,
  index,
  selectionMode,
  selected,
  onSelectedChange,
  onOpenDetails,
}: CaseCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLElement>(null);
  const openDetails = (trigger: HTMLElement) => {
    if (cardRef.current) {
      onOpenDetails(entry, { source: cardRef.current, trigger });
    }
  };
  const language = useCurrentLanguage();
  const title = pickCaseTitle(entry, language);
  const description = pickCaseDescription(entry, language);

  const handleCardClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!selectionMode) return;
    if ((event.target as HTMLElement).closest("[data-selection-control]")) return;
    event.preventDefault();
    event.stopPropagation();
    if (entry.promptUrl) onSelectedChange(entry.id, !selected);
  };

  return (
    <article
      ref={cardRef}
      onClickCapture={handleCardClickCapture}
      className="group flex flex-col overflow-hidden rounded-md border border-border/75 bg-card shadow-panel transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-raised">
      <div className="relative overflow-hidden border-b border-border/70">
        <CardLivePreview entry={entry} index={index} title={title} />
        {selectionMode && (
          <Checkbox
            data-selection-control
            checked={selected}
            disabled={!entry.promptUrl}
            onCheckedChange={(value) => entry.promptUrl && onSelectedChange(entry.id, value === true)}
            onClick={(event) => event.stopPropagation()}
            aria-label={entry.promptUrl ? t("card.selectPrompt", { title }) : t("detail.promptUnavailableTitle")}
            className="absolute left-3 top-3 z-20 h-8 w-8 border-2 border-foreground bg-background text-primary-foreground shadow-none data-[state=checked]:border-primary"
          />
        )}
        <button
          type="button"
          onClick={(event) => openDetails(event.currentTarget)}
          aria-label={
            selectionMode
              ? t("card.selectPrompt", { title })
              : t("card.openDetails", { title })
          }
          tabIndex={selectionMode ? -1 : 0}
          className="absolute inset-0 z-10 focus-visible:ring-inset"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={(event) => openDetails(event.currentTarget)}
          tabIndex={selectionMode ? -1 : 0}
          className="text-left"
        >
          <h3 className="font-display text-base font-semibold leading-snug tracking-[-0.015em] text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
        </button>

        <p className="mt-2 truncate text-xs leading-5 text-muted-foreground">
          {description}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/60 pt-2">
          <a
            href={entry.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={selectionMode ? -1 : 0}
            aria-disabled={selectionMode || undefined}
            className="inline-flex h-8 items-center gap-2 text-xs font-medium text-foreground transition-colors hover:text-primary"
          >
            {t("card.preview")}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>

          {entry.remixUrl ? (
            <Button asChild variant="ghost" className="h-8 px-2 text-xs">
              <a
                href={entry.remixUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={selectionMode ? -1 : 0}
                aria-disabled={selectionMode || undefined}
              >
                Remix
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          ) : (
            <span
              aria-disabled="true"
              title={t("card.remixUnavailable")}
              className="inline-flex h-8 cursor-not-allowed select-none items-center gap-1.5 px-2 text-[11px] text-muted-foreground/65"
            >
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              {t("card.remixComingSoon")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
});
