import { assetPath } from "@/lib/app-paths";
import type { ShowcaseCollection } from "./types";

export const gpt6SolLunaCollection: ShowcaseCollection = {
  slug: "gpt-6-sol-luna",
  legacySlugs: [],
  coverImage: assetPath("media/showcase-collections/gpt-6-sol-luna-dual-star.webp"),
  displayName: "GPT-6 Sol & Luna",
  modelPagePath: "/showcases/collection/gpt-6-sol-luna",
  documentTitle: "Enter × GPT-6 Sol & Luna — Collections",
  heroImage: assetPath("media/showcase-collections/gpt-6-sol-luna-dual-star.webp"),
  caseIds: [],
  getCopy: (t) => ({
    title: t("collections.solLunaTitle"),
    description: t("collections.solLunaDescription"),
    openLabel: t("collections.openSolLuna"),
    bundleTitle: t("bundle.docTitle"),
    hero: {
      eyebrow: "",
      titleLine1: "Enter × GPT-6",
      titleLine2: "Sol & Luna",
      image: assetPath("media/showcase-collections/gpt-6-sol-luna-dual-star.webp"),
      imageWidth: 1376,
      imageHeight: 768,
    },
  }),
};
