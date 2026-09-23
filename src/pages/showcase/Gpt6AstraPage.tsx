import { ArrowDown, ArrowLeft, ArrowUpRight, Layers3, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ModelPromptComposer } from "@/components/case-library/model-prompt-composer";
import { ModelPromptPlaceholder } from "@/components/case-library/model-prompt-placeholder";
import { ModelFaq } from "@/components/case-library/model-faq";
import { astraModel, getAstraCopy } from "@/data/model-pages/gpt-6-astra";
import { useAppHref } from "@/hooks/use-app-href";
import { useModelPageSeo } from "@/hooks/use-model-page-seo";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";
import "@/styles/showcase.css";
import "@/styles/model-detail.css";

export default function Gpt6AstraPage() {
  const { t } = useTranslation();
  const appHref = useAppHref();
  const { search } = useLocation();
  const libraryHref = `${appHref("/showcases")}${search}`;
  const copy = getAstraCopy(t);
  useShowcaseTheme(copy.title);
  useModelPageSeo(copy.title, copy.description, copy.faqs);

  return (
    <div className="showcase model-detail flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1">
        <div className="model-breadcrumb"><Link to={libraryHref}><ArrowLeft size={15} aria-hidden="true" />{t("modelAstra.back")}</Link><span aria-hidden="true">/</span><span>{astraModel.name}</span></div>
        <section className="model-hero" aria-labelledby="model-title">
          <div className="model-hero-copy">
            <p className="model-eyebrow"><span className="model-eyebrow-line" aria-hidden="true" />{t("collections.directoryEyebrow")}</p>
            <h1 id="model-title"><span className="model-name">{astraModel.name}</span>{" "}<span className="model-headline">{t("modelAstra.heading")}</span></h1>
            <p className="model-hero-tagline">{t("modelAstra.tagline")}</p>
            <ModelPromptComposer />
            <a href="#all-prompts" className="model-browse-link">{t("modelAstra.browse")}<ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <div className="model-hero-art">
            <img src={astraModel.image} alt="" width={1280} height={720} fetchPriority="high" decoding="async" />
            <div className="model-art-caption"><span>ENTER × GPT-6 ASTRA</span><span aria-hidden="true">01 / MODEL</span></div>
          </div>
        </section>
        <section id="all-prompts" className="model-section model-prompts" aria-labelledby="all-prompts-title">
          <div className="model-prompts-heading"><span className="model-section-index" aria-hidden="true">01 / PROMPT LIBRARY</span><h2 id="all-prompts-title">{t("modelAstra.allPrompts")}</h2><p>{t("modelAstra.allDescription")}</p></div>
          <div className="model-prompts-grid">{[1, 2, 3].map(number => <ModelPromptPlaceholder key={number} number={number} />)}</div>
        </section>
        <section className="model-section model-about" aria-labelledby="model-about-title">
          <div className="model-about-heading"><span className="model-section-index" aria-hidden="true">02 / GPT-6 ASTRA</span><h2 id="model-about-title">{t("modelAstra.aboutTitle")}</h2></div>
          <div className="model-about-panels">
            <div className="model-about-copy"><span className="model-panel-icon"><Layers3 size={22} strokeWidth={1.5} aria-hidden="true" /></span><p>{t("modelAstra.aboutBody")}</p></div>
            <div className="model-usage"><span className="model-panel-icon"><SlidersHorizontal size={22} strokeWidth={1.5} aria-hidden="true" /></span><h3>{t("modelAstra.useTitle")}</h3><p>{t("modelAstra.useBody")}</p><Link className="model-text-link" to={libraryHref}>{t("modelAstra.libraryLink")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </div>
        </section>
        <ModelFaq title={t("modelAstra.faqTitle")} faqs={copy.faqs} libraryHref={libraryHref} libraryLabel={t("modelAstra.libraryLink")} />
      </main>
      <Footer />
    </div>
  );
}
