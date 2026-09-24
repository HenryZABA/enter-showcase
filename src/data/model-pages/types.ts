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
};

export type ModelPageCopy = {
  title: string;
  description: string;
  back: string;
  heading: string;
  browse: string;
  hotCases: string;
  hotDescription: string;
  trendingPrompts: string;
  trendingDescription: string;
  faqTitle: string;
  libraryLink: string;
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
