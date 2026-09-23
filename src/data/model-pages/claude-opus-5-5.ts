import type { TFunction } from "i18next";
import { assetPath } from "../../lib/app-paths";
import type { ModelPageCopy, ModelPageModel } from "./types";

export const opusModel: ModelPageModel = {
  slug: "claude-opus-5-5",
  name: "Claude Opus 5.5",
  canonical: "https://enter.converge.ai/prompts/claude-opus-5-5",
  keywords: "Claude Opus 5.5, Enter model collection",
  image: assetPath("media/showcase-collections/claude-opus-5-5-cover-v1.webp"),
  artCaption: "ENTER / CLAUDE OPUS 5.5",
};

/** No model-specific cases or source prompts have been provided yet. */
export function getOpusCopy(t: TFunction): ModelPageCopy {
  return {
    title: t("modelOpus.metaTitle"),
    description: t("modelOpus.metaDescription"),
    back: t("modelAstra.back"),
    eyebrow: t("collections.directoryEyebrow"),
    heading: t("modelAstra.heading"),
    tagline: t("modelOpus.tagline"),
    browse: t("modelAstra.browse"),
    hotCases: t("modelPages.hotCases"),
    hotDescription: t("modelPages.hotDescriptionPending"),
    trendingPrompts: t("modelPages.trendingPrompts"),
    trendingDescription: t("modelPages.trendingDescription"),
    faqTitle: "",
    libraryLink: t("modelAstra.libraryLink"),
    composer: {
      label: t("modelAstra.composerLabel"), hint: t("modelAstra.composerHint"), copyOpen: t("modelAstra.copyOpen"), copying: t("modelAstra.copying"), copyError: t("modelAstra.copyError"),
    },
    faqs: [],
  };
}
