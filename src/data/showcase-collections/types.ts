import type { TFunction } from "i18next";

export type ShowcaseHeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  image: string;
  imageSrcSet?: string;
  imageWidth: number;
  imageHeight: number;
};

export type ShowcaseCollection = {
  slug: string;
  legacySlugs?: readonly string[];
  coverImage: string;
  coverVideo?: string;
  documentTitle: string;
  displayName: string;
  heroImage: string;
  caseIds: readonly string[];
  /** Evaluate with the current translator, never cache translated UI at module scope. */
  getCopy: (t: TFunction) => {
    title: string;
    description: string;
    openLabel: string;
    bundleTitle: string;
    hero: ShowcaseHeroContent;
  };
};
