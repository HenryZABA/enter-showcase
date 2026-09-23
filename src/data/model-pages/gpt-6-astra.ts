import type { TFunction } from "i18next";
import { assetPath } from "../../lib/app-paths";

export const astraModel = {
  name: "GPT-6 Astra",
  path: "/showcases/gpt-6-astra",
  canonical: "https://enter.converge.ai/prompts/gpt-6-astra",
  title: "Free GPT-6 Astra Prompts and App Examples | Enter",
  description: "Discover GPT-6 Astra prompts for websites, apps, and interactive experiences in Enter. Learn how to get started; curated prompts and app examples are coming soon.",
  keywords: "GPT-6 Astra, GPT-6 Astra prompt, GPT-6 Astra prompts, GPT-6 Astra app examples",
  image: assetPath("media/showcase-collections/gpt-6-astra-poster-v1.webp"),
} as const;

export function getAstraCopy(t: TFunction) {
  return {
    title: t("modelAstra.metaTitle"),
    description: t("modelAstra.metaDescription"),
    faqs: [
      { id: "build", question: t("modelAstra.faqBuildQuestion"), answer: t("modelAstra.faqBuildAnswer") },
      { id: "use", question: t("modelAstra.faqUseQuestion"), answer: t("modelAstra.faqUseAnswer") },
      { id: "edit", question: t("modelAstra.faqEditQuestion"), answer: t("modelAstra.faqEditAnswer") },
      { id: "sources", question: t("modelAstra.faqSourcesQuestion"), answer: t("modelAstra.faqSourcesAnswer") },
      { id: "ideas", question: t("modelAstra.faqIdeasQuestion"), answer: t("modelAstra.faqIdeasAnswer") },
    ],
  };
}

export type ModelFaq = ReturnType<typeof getAstraCopy>["faqs"][number];

export function astraFaqSchema(faqs: ModelFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
