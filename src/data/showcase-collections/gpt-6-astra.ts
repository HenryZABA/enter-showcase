import { assetPath } from "@/lib/app-paths";
import type { ShowcaseCollection } from "./types";

/** One curated collection, not the identity or implicit membership of Showcase. */
export const gpt6AstraCollection: ShowcaseCollection = {
  slug: "gpt6",
  legacySlugs: ["gpt-6-astra"],
  coverImage: assetPath("media/showcase-collections/gpt-6-astra-poster-v1.webp"),
  coverVideo: assetPath("media/showcase-collections/gpt-6-astra-v1.mp4"),
  displayName: "GPT-6 Astra",
  modelPagePath: "/showcases/gpt-6-astra",
  documentTitle: "Enter × GPT-6 Astra — Case Library",
  heroImage: assetPath("images/showcase/prism-1280-v1.webp"),
  caseIds: [
    "d6b40daaf4ea4ba88b2a5aa5d3f4c6d8",
    "8913089c9e184d1aad4b0310a5b7fb96",
    "ac436982c25144eb83faf94a06cb904a",
    "a2a3b1836aac46d1bb5d3d09715848db",
    "674a7f6546ea4ff5a2c6fd7394aa5a2b",
    "b84a5c72086842a7ab8c77b6fa935f01",
    "741bada9961f4d2186c85316f16a05c8",
    "3b395dba2e1f49138c9b8d5ac5b6710e",
    "92ef2d78e1b6478ab1f5bda3ca160641",
    "d5025a8116e04650b4f1aa05ceda76e4",
    "ef0378ba7d45412ca7550377eec9f180",
    "fea402c71dab4f66b91fadb41946b70f",
    "cc26e5a341804bfbb139d28f5e49c237",
    "9a3b574243ac45b39c004db93ea520b3",
  ],
  getCopy: (t) => ({
    title: t("collections.gpt6Title"),
    description: t("collections.directoryGpt6Description"),
    openLabel: t("collections.openGpt6"),
    bundleTitle: t("bundle.docTitle"),
    hero: {
      eyebrow: "",
      titleLine1: t("hero.titleLine1"),
      titleLine2: t("hero.titleLine2"),
      image: assetPath("images/showcase/prism-1280-v1.webp"),
      imageSrcSet: [
        `${assetPath("images/showcase/prism-640-v1.webp")} 640w`,
        `${assetPath("images/showcase/prism-1280-v1.webp")} 1280w`,
        `${assetPath("images/showcase/prism-1920-v1.webp")} 1920w`,
      ].join(", "),
      imageWidth: 1920,
      imageHeight: 1072,
    },
  }),
};
