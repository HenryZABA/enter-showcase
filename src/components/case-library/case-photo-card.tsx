import { useId, useRef } from "react";
import { preloadCaseDetail } from "./detail-loader";
import { useTranslation } from "react-i18next";
import type { CaseCardProps } from "@/components/case-library/case-card";
import { Checkbox } from "@/components/ui/checkbox";
import { caseGallery, caseGalleryImage } from "@/data/case-gallery";
import { pickLocalized } from "@/data/cases";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { pickCaseTitle } from "@/hooks/use-case-filters";

export function CasePhotoCard({ entry, selectionMode, selected, onSelectedChange, onOpenDetails }: CaseCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const captionId = useId();
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const title = pickCaseTitle(entry, language);
  const gallery = entry.gallery ?? caseGallery[entry.id];
  const imageUrl = entry.gallery?.imageUrl || caseGalleryImage(entry.id);

  return (
    <article
      ref={cardRef}
      className="case-photo-card"
      data-format={gallery.format}
      data-selected={selectionMode && selected}
    >
      <div className="case-photo-media">
        <img
          src={imageUrl}
          srcSet={entry.gallery ? undefined : `${caseGalleryImage(entry.id, true)} 600w, ${caseGalleryImage(entry.id)} 1200w`}
          sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 62px) / 2), 400px"
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          alt=""
          draggable={false}
        />
        <div className="case-photo-caption">
          <p id={captionId}>{pickLocalized(gallery.caption, language)}</p>
        </div>
      </div>
      <button
        type="button"
        className="case-photo-trigger"
        aria-label={selectionMode ? t("card.selectPrompt", { title }) : t("card.openDetails", { title })}
        aria-describedby={captionId}
        tabIndex={selectionMode ? -1 : 0}
        disabled={selectionMode && !entry.prompt}
        onPointerEnter={selectionMode ? undefined : preloadCaseDetail}
        onFocus={selectionMode ? undefined : preloadCaseDetail}
        onPointerDown={selectionMode ? undefined : preloadCaseDetail}
        onClick={(event) => {
          if (selectionMode) {
            if (entry.prompt) onSelectedChange(!selected);
          } else if (cardRef.current) {
            onOpenDetails(entry, { source: cardRef.current, trigger: event.currentTarget });
          }
        }}
      />
      {selectionMode && (
        <Checkbox
          checked={selected}
          disabled={!entry.prompt}
          onCheckedChange={(value) => entry.prompt && onSelectedChange(value === true)}
          aria-label={entry.prompt ? t("card.selectPrompt", { title }) : t("detail.promptUnavailableTitle")}
          className="absolute left-3 top-3 z-20 h-8 w-8 border-2 border-foreground bg-background text-primary-foreground shadow-none data-[state=checked]:border-primary"
        />
      )}
    </article>
  );
}
