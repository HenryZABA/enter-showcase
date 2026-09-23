import { ArrowDown, ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { ModelPageCopy, ModelPageModel } from "@/data/model-pages/types";
import { useAppHref } from "@/hooks/use-app-href";
import { useModelPageSeo } from "@/hooks/use-model-page-seo";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ModelFaq } from "./model-faq";
import { ModelPromptCategories } from "./model-prompt-categories";
import { ModelPromptComposer } from "./model-prompt-composer";
import "@/styles/showcase.css";
import "@/styles/model-detail.css";

type Props = {
  model: ModelPageModel;
  copy: ModelPageCopy;
  initialPrompt: string;
  hotContent: ReactNode;
};

export function ModelDetailPage({ model, copy, initialPrompt, hotContent }: Props) {
  const appHref = useAppHref();
  const { search } = useLocation();
  const libraryHref = `${appHref("/showcases")}${search}`;
  useShowcaseTheme(copy.title);
  useModelPageSeo(model, copy.title, copy.description, copy.faqs);

  return (
    <div className="showcase model-detail flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1">
        <div className="model-breadcrumb"><Link to={libraryHref}><ArrowLeft size={15} aria-hidden="true" />{copy.back}</Link><span aria-hidden="true">/</span><span>{model.name}</span></div>
        <section className="model-hero" aria-labelledby="model-title">
          <div className="model-hero-copy">
            <p className="model-eyebrow"><span className="model-eyebrow-line" aria-hidden="true" />{copy.eyebrow}</p>
            <h1 id="model-title"><span className="model-name">{model.name}</span>{" "}<span className="model-headline">{copy.heading}</span></h1>
            <p className="model-hero-tagline">{copy.tagline}</p>
            <ModelPromptComposer modelLabel={model.name.toUpperCase()} initialPrompt={initialPrompt} copy={copy.composer} />
            <a href="#hot-prompts" className="model-action model-action-secondary model-browse-link">{copy.browse}<ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <div className="model-hero-art">
            <div className="model-art-stage"><img src={model.image} alt="" width={1280} height={720} fetchPriority="high" decoding="async" /></div>
            <div className="model-art-caption"><span>{model.artCaption}</span><span aria-hidden="true">01 / MODEL</span></div>
          </div>
        </section>
        <section id="hot-prompts" className="model-section model-prompts model-hot-prompts" aria-labelledby="hot-prompts-title">
          <div className="model-prompts-heading"><span className="model-section-index" aria-hidden="true">01 / ENTER ORIGINALS</span><h2 id="hot-prompts-title">{copy.hotPrompts}</h2><p>{copy.hotDescription}</p></div>
          {hotContent}
        </section>
        <section id="all-prompts" className="model-section model-prompts" aria-labelledby="all-prompts-title">
          <div className="model-prompts-heading"><span className="model-section-index" aria-hidden="true">02 / PROMPT LIBRARY</span><h2 id="all-prompts-title">{copy.allPrompts}</h2><p>{copy.allDescription}</p></div>
          <ModelPromptCategories copy={copy.categories} placeholderCopy={copy.placeholder} />
        </section>
        <section className="model-section model-about" aria-labelledby="model-about-title">
          <div className="model-about-heading"><span className="model-section-index" aria-hidden="true">03 / {model.name.toUpperCase()}</span><h2 id="model-about-title">{copy.aboutTitle}</h2></div>
          <div className="model-about-panels">
            <div className="model-about-copy"><span className="model-panel-icon"><Layers3 size={22} strokeWidth={1.5} aria-hidden="true" /></span><p>{copy.aboutBody}</p></div>
            <div className="model-usage"><h3>{copy.useTitle}</h3><p>{copy.useBody}</p><div className="model-about-actions"><a className="model-action theme-primary-gradient" href="https://enter.converge.ai/workspace">{copy.buildWithEnter}<ArrowUpRight size={16} aria-hidden="true" /></a></div></div>
          </div>
        </section>
        <ModelFaq title={copy.faqTitle} faqs={copy.faqs} libraryHref={libraryHref} libraryLabel={copy.libraryLink} />
      </main>
      <Footer />
    </div>
  );
}
