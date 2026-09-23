export type ModelFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ModelPageModel = {
  slug: string;
  name: string;
  canonical: string;
  keywords: string;
  image: string;
  artCaption: string;
};

export type ModelComposerCopy = {
  label: string;
  hint: string;
  copyOpen: string;
  copying: string;
  copyError: string;
};

export type ModelPageCopy = {
  title: string;
  description: string;
  back: string;
  eyebrow: string;
  heading: string;
  tagline: string;
  browse: string;
  hotCases: string;
  hotDescription: string;
  trendingPrompts: string;
  trendingDescription: string;
  aboutTitle: string;
  aboutBody: string;
  useTitle: string;
  useBody: string;
  buildWithEnter: string;
  faqTitle: string;
  libraryLink: string;
  composer: ModelComposerCopy;
  faqs: ModelFaq[];
};

export function modelFaqSchema(faqs: ModelFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
