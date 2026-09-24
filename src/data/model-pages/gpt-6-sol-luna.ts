import type { TFunction } from "i18next";
import { assetPath } from "../../lib/app-paths";
import type { ModelPageCopy, ModelPageModel } from "./types";

export const solLunaModel: ModelPageModel = {
  slug: "gpt-6-sol-luna",
  name: "GPT-6 Sol & Luna",
  canonical: "https://enter.converge.ai/prompts/collection/gpt-6-sol-luna",
  keywords: "GPT-6 Sol, GPT-6 Luna, GPT-6 prompts, GPT-6 app examples, Sol and Luna prompts",
  image: assetPath("media/showcase-collections/gpt-6-sol-luna-dual-star.webp"),
};

export const solLunaInitialPrompt = ""; // No model-attributed prompt is published yet.

export function getSolLunaCopy(t: TFunction): ModelPageCopy {
  return {
    title: t("modelSolLuna.metaTitle"),
    description: t("modelSolLuna.metaDescription"),
    back: t("modelAstra.back"),
    heading: t("modelSolLuna.heading"),
    browse: t("modelAstra.browse"),
    hotCases: t("modelPages.hotCases"),
    hotDescription: t("modelPages.hotDescriptionPending"),
    trendingPrompts: t("modelPages.trendingPrompts"),
    trendingDescription: t("modelPages.trendingDescription"),
    faqTitle: t("modelSolLuna.faqTitle"),
    libraryLink: t("modelAstra.libraryLink"),
    composer: {
      label: t("modelAstra.composerLabel"), hint: t("prompt.downloadHint"),
    },
    faqs: [
      { id: "build", question: t("modelSolLuna.faqBuildQuestion"), answer: t("modelSolLuna.faqBuildAnswer") },
      { id: "use", question: t("modelSolLuna.faqUseQuestion"), answer: t("modelSolLuna.faqUseAnswer") },
      { id: "choose", question: t("modelSolLuna.faqChooseQuestion"), answer: t("modelSolLuna.faqChooseAnswer") },
      { id: "edit", question: t("modelSolLuna.faqEditQuestion"), answer: t("modelSolLuna.faqEditAnswer") },
      { id: "ideas", question: t("modelSolLuna.faqIdeasQuestion"), answer: t("modelSolLuna.faqIdeasAnswer") },
    ],
  };
}
