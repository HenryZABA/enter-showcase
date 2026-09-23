import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ModelEmptySection } from "@/components/case-library/model-empty-section";
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
            <a href="#featured-prompts" className="model-browse theme-primary-gradient">{t("modelAstra.browse")}<ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className="model-hero-art">
            <img src={astraModel.image} alt="" width={1280} height={720} fetchPriority="high" decoding="async" />
            <div className="model-art-caption"><span>ENTER × GPT-6 ASTRA</span><span aria-hidden="true">01 / MODEL</span></div>
          </div>
        </section>
        <ModelEmptySection id="featured-prompts" index="01" title={t("modelAstra.featured")} label={t("collections.comingSoon")} message={t("modelAstra.casesEmpty")} kind="cases" />
        <ModelEmptySection id="all-prompts" index="02" title={t("modelAstra.allPrompts")} label={t("collections.comingSoon")} message={t("modelAstra.promptsEmpty")} kind="prompts" />
        <section className="model-section model-about" aria-labelledby="model-about-title">
          <div className="model-about-heading"><span className="model-section-index" aria-hidden="true">03 / GPT-6 ASTRA</span><h2 id="model-about-title">{t("modelAstra.aboutTitle")}</h2></div>
          <div className="model-about-copy"><p>{t("modelAstra.aboutBody")}</p><div className="model-usage"><h3>{t("modelAstra.useTitle")}</h3><p>{t("modelAstra.useBody")}</p><Link className="model-text-link" to={libraryHref}>{t("modelAstra.libraryLink")}<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div>
        </section>
        <ModelFaq title={t("modelAstra.faqTitle")} faqs={copy.faqs} libraryHref={libraryHref} libraryLabel={t("modelAstra.libraryLink")} />
      </main>
      <Footer />
    </div>
  );
}
