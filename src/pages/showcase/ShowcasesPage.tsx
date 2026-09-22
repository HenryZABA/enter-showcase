import { useTranslation } from "react-i18next";
import { ShowcaseLibraryView } from "@/components/case-library/showcase-library-view";
import { cases } from "@/data/cases";
import { featuredShowcaseCollection } from "@/data/showcase-collections";

/** Showcase's catalog home. The hero features a collection; it is not that collection. */
export default function ShowcasesPage() {
  const { t } = useTranslation();
  const featured = featuredShowcaseCollection.getCopy(t);
  return <ShowcaseLibraryView
    entries={cases}
    layout="catalog"
    documentTitle="Enter Library — Curated Case Collections"
    heading={t("gallery.heading")}
    hero={featured.hero}
    collectionHref="#cases"
    bundleTitle={t("showcase.bundleTitle")}
    downloadFileName="library-selected-prompts.md"
  />;
}
