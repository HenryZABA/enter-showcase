import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import type { CaseCategoryId } from "@/data/cases";

type CaseCoverProps = {
  category: CaseCategoryId;
  /** 1-based position, drawn as a restrained index numeral. */
  index: number;
  className?: string;
};

/**
 * Deterministic typographic artwork used as a case cover.
 *
 * These are intentionally abstract: they are original artwork for the library,
 * never a screenshot of the build, and the UI labels them as such so a visitor
 * is not led to believe they are looking at the real interface.
 */
const CategoryMotif = ({ category }: { category: CaseCategoryId }) => {
  if (category === "interactive3d") {
    return (
      <g
        className="stroke-primary/45"
        fill="none"
        strokeWidth={1.5}
        strokeLinejoin="round"
      >
        <path d="M200 74l46 26v52l-46 26-46-26v-52z" />
        <path d="M200 74v52l46 26M200 126l-46 26" />
        <circle cx="200" cy="126" r="76" className="stroke-primary/15" />
      </g>
    );
  }

  if (category === "business") {
    return (
      <g fill="none" strokeWidth={1.5} strokeLinecap="round">
        <g className="stroke-primary/40">
          <path d="M150 168h100" />
          <path d="M166 168v-34M190 168v-58M214 168v-42M238 168v-72" />
        </g>
        <rect
          x="138"
          y="70"
          width="124"
          height="112"
          rx="8"
          className="stroke-primary/15"
        />
      </g>
    );
  }

  return (
    <g fill="none" strokeWidth={1.5} strokeLinecap="round">
      <g className="stroke-primary/40">
        <path d="M156 152a44 44 0 0 1 88 0" />
        <path d="M172 152a28 28 0 0 1 56 0" />
      </g>
      <circle cx="200" cy="152" r="5" className="fill-primary/40 stroke-none" />
      <circle cx="200" cy="140" r="74" className="stroke-primary/15" />
    </g>
  );
};

export const CaseCover = ({ category, index, className }: CaseCoverProps) => {
  const { t } = useTranslation();

  const categoryLabel =
    category === "interactive3d"
      ? t("category.interactive3d")
      : category === "business"
        ? t("category.business")
        : t("category.creative");

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden bg-secondary",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 225"
        className="h-full w-full"
        role="img"
        aria-label={`${t("card.artworkLabel")} — ${categoryLabel}`}
      >
        <rect width="400" height="225" className="fill-card" />
        {/* Draw the grid directly instead of using url(#pattern). This avoids
            duplicate or hydration-sensitive SVG ids when many covers render. */}
        <path
          d="M25 0v225M50 0v225M75 0v225M100 0v225M125 0v225M150 0v225M175 0v225M200 0v225M225 0v225M250 0v225M275 0v225M300 0v225M325 0v225M350 0v225M375 0v225M0 25h400M0 50h400M0 75h400M0 100h400M0 125h400M0 150h400M0 175h400M0 200h400"
          fill="none"
          className="stroke-border"
          strokeWidth={1}
        />
        <CategoryMotif category={category} />
        <text
          x="28"
          y="58"
          className="fill-foreground/10 font-display"
          fontSize="52"
          fontWeight="500"
        >
          {String(index).padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
};
