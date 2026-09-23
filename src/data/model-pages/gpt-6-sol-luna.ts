import type { TFunction } from "i18next";
import { assetPath } from "../../lib/app-paths";
import type { ModelPageCopy, ModelPageModel } from "./types";

export const solLunaModel: ModelPageModel = {
  slug: "gpt-6-sol-luna",
  name: "GPT-6 Sol & Luna",
  canonical: "https://enter.converge.ai/prompts/gpt-6-sol-luna",
  keywords: "GPT-6 Sol, GPT-6 Luna, GPT-6 prompts, GPT-6 app examples, Sol and Luna prompts",
  image: assetPath("media/showcase-collections/gpt-6-sol-luna-dual-star.webp"),
  artCaption: "ENTER × GPT-6 SOL / LUNA",
};

export const solLunaInitialPrompt = "Build a polished product launch workspace with a campaign overview, an execution board, and a rapid iteration area. Make it responsive, visually refined, and easy to evolve from first concept to final release.";

export function getSolLunaCopy(t: TFunction): ModelPageCopy {
  return {
    title: t("modelSolLuna.metaTitle"),
    description: t("modelSolLuna.metaDescription"),
    back: t("modelAstra.back"),
    eyebrow: t("collections.directoryEyebrow"),
    heading: t("modelSolLuna.heading"),
    tagline: t("modelSolLuna.tagline"),
    browse: t("modelAstra.browse"),
    hotPrompts: t("modelSolLuna.hotPrompts"),
    hotDescription: t("modelSolLuna.hotDescription"),
    allPrompts: t("modelAstra.allPrompts"),
    allDescription: t("modelSolLuna.allDescription"),
    aboutTitle: t("modelSolLuna.aboutTitle"),
    aboutBody: t("modelSolLuna.aboutBody"),
    useTitle: t("modelSolLuna.useTitle"),
    useBody: t("modelSolLuna.useBody"),
    buildWithEnter: t("modelAstra.buildWithEnter"),
    faqTitle: t("modelSolLuna.faqTitle"),
    libraryLink: t("modelAstra.libraryLink"),
    composer: {
      label: t("modelAstra.composerLabel"), hint: t("modelAstra.composerHint"), copyOpen: t("modelAstra.copyOpen"), copying: t("modelAstra.copying"), copyError: t("modelAstra.copyError"),
    },
    placeholder: {
      pending: t("modelAstra.pending"), videoPending: t("modelAstra.videoPending"), casePending: t("modelAstra.casePending"), cardDescription: t("modelAstra.cardDescription"), promptLabel: t("modelAstra.promptLabel"), promptPending: t("modelAstra.promptPending"), cardAction: t("modelAstra.cardAction"), cardNote: t("modelAstra.cardNote"),
    },
    categories: {
      label: t("modelAstra.categoryLabel"), all: t("modelAstra.categoryAll"), website: t("modelAstra.categoryWebsite"), app: t("modelAstra.categoryApp"), other: t("modelAstra.categoryOther"), empty: t("modelAstra.categoryEmpty"),
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
