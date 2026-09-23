import { ArrowDown, ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { LiquidLink } from "@/components/ui/liquid-glass-button";
import type { ModelPageCopy, ModelPageModel } from "@/data/model-pages/types";
import { trendingPromptsByModel } from "@/data/model-pages/trending-prompts";
import type { ShowcaseCollection } from "@/data/showcase-collections";
import { useAppHref } from "@/hooks/use-app-href";
import { useModelPageSeo } from "@/hooks/use-model-page-seo";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ModelFaq } from "./model-faq";
import { ModelHotCaseGallery } from "./model-hot-case-gallery";
import { ModelTrendingPrompts } from "./model-trending-prompts";
import { ModelPromptComposer } from "./model-prompt-composer";
import "@/styles/showcase.css";
import "@/styles/model-detail.css";

type Props = {
  model: ModelPageModel;
  copy: ModelPageCopy;
  initialPrompt: string;
  collection: ShowcaseCollection;
};

export function ModelDetailPage({ model, collection, copy, initialPrompt }: Props) {
  const appHref = useAppHref();
  const { search } = useLocation();
  const libraryHref = `${appHref("/showcases")}${search}`;
  useShowcaseTheme(copy.title);
  useModelPageSeo(model, copy.title, copy.description, copy.faqs);

  return (
    <div className="showcase model-detail flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1">
        <div className="model-breadcrumb"><LiquidLink to={libraryHref} size="lg"><ArrowLeft aria-hidden="true" />{copy.back}</LiquidLink><span aria-hidden="true">/</span><span>{model.name}</span></div>
        <section className="model-hero" aria-labelledby="model-title">
          <div className="model-hero-copy">
            <p className="model-eyebrow"><span className="model-eyebrow-line" aria-hidden="true" />{copy.eyebrow}</p>
            <h1 id="model-title"><span className="model-name">{model.name}</span>{" "}<span className="model-headline">{copy.heading}</span></h1>
            <p className="model-hero-tagline">{copy.tagline}</p>
            <ModelPromptComposer modelLabel={model.name.toUpperCase()} initialPrompt={initialPrompt} copy={copy.composer} />
            {collection.caseIds.length > 0 && <a href="#hot-cases" className="model-action model-action-secondary model-browse-link">{copy.browse}<ArrowDown size={15} aria-hidden="true" /></a>}
          </div>
          <div className="model-hero-art">
            <div className="model-art-stage"><img src={model.image} alt="" width={1280} height={720} fetchPriority="high" decoding="async" /></div>
            <div className="model-art-caption"><span>{model.artCaption}</span><span aria-hidden="true">01 / MODEL</span></div>
          </div>
        </section>
        <section id="hot-cases" className="model-section model-prompts model-hot-cases" aria-labelledby="hot-cases-title">
          <div className="model-prompts-heading"><span className="model-section-index" aria-hidden="true">01 / ENTER CASES</span><h2 id="hot-cases-title">{copy.hotCases}</h2><p>{copy.hotDescription}</p></div>
          <ModelHotCaseGallery collection={collection} />
        </section>
        <section id="trending-prompts" className="model-section model-prompts" aria-labelledby="trending-prompts-title">
          <div className="model-prompts-heading"><span className="model-section-index" aria-hidden="true">02 / COMMUNITY PROMPTS</span><h2 id="trending-prompts-title">{copy.trendingPrompts}</h2><p>{copy.trendingDescription}</p></div>
          <ModelTrendingPrompts entries={trendingPromptsByModel[model.slug] ?? []} />
        </section>
        {copy.faqs.length > 0 && <ModelFaq title={copy.faqTitle} faqs={copy.faqs} libraryHref={libraryHref} libraryLabel={copy.libraryLink} />}
      </main>
      <Footer />
    </div>
  );
}
