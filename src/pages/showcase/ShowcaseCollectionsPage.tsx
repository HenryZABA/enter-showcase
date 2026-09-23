import { ArrowLeft } from "lucide-react";
import { LiquidLink } from "@/components/ui/liquid-glass-button";
import { useTranslation } from "react-i18next";
import { CollectionCard } from "@/components/case-library/collection-card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { showcaseCollections, showcaseCollectionHref } from "@/data/showcase-collections";
import { useAppHref } from "@/hooks/use-app-href";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";
import "@/styles/showcase.css";
import "@/styles/collection-directory.css";

export default function ShowcaseCollectionsPage() {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const appHref = useAppHref();
  const href = (path: string) => `${appHref(path)}?${new URLSearchParams({ hl: language })}`;
  useShowcaseTheme(t("collections.directoryTitle"));

  return (
    <div className="showcase collection-directory flex min-h-screen flex-col">
      <Header showSearch={false} />
      <main className="container flex-1 pb-20">
        <LiquidLink to={href("/showcases")} size="lg" className="collection-directory-back">
          <ArrowLeft aria-hidden="true" />
          {t("youcases.backToShowcases")}
        </LiquidLink>
        <div className="collection-directory-heading">
          <h1>{t("collections.directoryHeading")}</h1>
        </div>
        <div className="collection-directory-grid">
          {showcaseCollections.map((collection, index) => (
            <CollectionCard key={collection.slug} collection={collection} href={href(showcaseCollectionHref(collection))} priority={index === 0} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
