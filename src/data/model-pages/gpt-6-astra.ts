import type { TFunction } from "i18next";
import { assetPath } from "../../lib/app-paths";
import type { ModelPageCopy, ModelPageModel } from "./types";

export const astraModel: ModelPageModel = {
  slug: "gpt-6-astra",
  name: "GPT-6 Astra",
  canonical: "https://enter.converge.ai/prompts/collection/gpt-6-astra",
  keywords: "GPT-6 Astra, GPT-6 Astra prompt, GPT-6 Astra prompts, GPT-6 Astra app examples",
  image: assetPath("media/showcase-collections/gpt-6-astra-poster-v1.webp"),
};

export const astraInitialPrompt = "Build a responsive project dashboard where I can create projects, assign tasks, track progress, and filter work by status. Add a clean overview with deadlines, priorities, and a dark mode toggle.";

export function getAstraCopy(t: TFunction): ModelPageCopy {
  return {
    title: t("modelAstra.metaTitle"),
    description: t("modelAstra.metaDescription"),
    back: t("modelAstra.back"),
    heading: t("modelAstra.heading"),
    browse: t("modelAstra.browse"),
    hotCases: t("modelPages.hotCases"),
    hotDescription: t("modelAstra.hotDescription"),
    trendingPrompts: t("modelPages.trendingPrompts"),
    trendingDescription: t("modelPages.trendingDescription"),
    faqTitle: t("modelAstra.faqTitle"),
    libraryLink: t("modelAstra.libraryLink"),
    composer: {
      label: t("modelAstra.composerLabel"), hint: t("prompt.downloadHint"),
    },
    faqs: [
      { id: "build", question: t("modelAstra.faqBuildQuestion"), answer: t("modelAstra.faqBuildAnswer") },
      { id: "use", question: t("modelAstra.faqUseQuestion"), answer: t("modelAstra.faqUseAnswer") },
      { id: "edit", question: t("modelAstra.faqEditQuestion"), answer: t("modelAstra.faqEditAnswer") },
      { id: "sources", question: t("modelAstra.faqSourcesQuestion"), answer: t("modelAstra.faqSourcesAnswer") },
      { id: "ideas", question: t("modelAstra.faqIdeasQuestion"), answer: t("modelAstra.faqIdeasAnswer") },
    ],
  };
}
