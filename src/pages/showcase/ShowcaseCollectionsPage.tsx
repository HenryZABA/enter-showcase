import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CollectionCard } from "@/components/case-library/collection-card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { showcaseCollections, showcaseCollectionHref } from "@/data/showcase-collections";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { useShowcaseTheme } from "@/hooks/use-showcase-theme";
import "@/styles/showcase.css";
import "@/styles/collection-directory.css";

export default function ShowcaseCollectionsPage() {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const href = (path: string) => `${path}?${new URLSearchParams({ hl: language })}`;
  useShowcaseTheme(t("collections.directoryTitle"));

  return (
    <div className="showcase collection-directory flex min-h-screen flex-col">
      <Header showSearch={false} />
      <main className="container flex-1 pb-20">
        <Link to={href("/showcases")} className="collection-directory-back">
          <ArrowLeft size={15} aria-hidden="true" />
          {t("youcases.backToShowcases")}
        </Link>
        <div className="collection-directory-heading">
          <p className="collection-directory-eyebrow">{t("collections.directoryEyebrow")}</p>
          <h1>{t("collections.directoryHeading")}</h1>
          <p className="collection-directory-intro">{t("collections.directoryDescription")}</p>
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
