import { assetPath } from "@/lib/app-paths";
import type { ShowcaseCollection } from "./types";

const cover = assetPath("media/showcase-collections/claude-opus-5-5-cover-v1.webp");

/** Media is abstract collection art; no Enter projects are attributed until verified. */
export const claudeOpus55Collection: ShowcaseCollection = {
  slug: "claude-opus-5-5",
  legacySlugs: [],
  coverImage: cover,
  displayName: "Claude Opus 5.5",
  modelPagePath: "/showcases/collection/claude-opus-5-5",
  documentTitle: "Claude Opus 5.5 — Enter Collections",
  heroImage: cover,
  caseIds: [],
  getCopy: (t) => ({
    title: t("collections.opusTitle"),
    description: t("collections.opusDescription"),
    openLabel: t("collections.openOpus"),
    bundleTitle: t("bundle.docTitle"),
    hero: {
      eyebrow: "",
      titleLine1: "Claude Opus",
      titleLine2: "5.5",
      image: cover,
      imageWidth: 1376,
      imageHeight: 768,
    },
  }),
};
