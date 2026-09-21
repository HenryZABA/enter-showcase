import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ShowcaseLibraryView } from "@/components/case-library/showcase-library-view";
import { getShowcaseCollectionCases, type ShowcaseCollection } from "@/data/showcase-collections";

/** Generic entry for registered curated collections; other collection routes stay intact. */
export default function CuratedShowcaseCollectionPage({ collection }: { collection: ShowcaseCollection }) {
  const { t } = useTranslation();
  const entries = useMemo(() => getShowcaseCollectionCases(collection), [collection]);
  const copy = collection.getCopy(t);
  return <ShowcaseLibraryView
    key={collection.slug}
    entries={entries}
    layout="collection"
    documentTitle={collection.documentTitle}
    heading={copy.title}
    hero={copy.hero}
    bundleTitle={copy.bundleTitle}
    downloadFileName={`${collection.slug}-selected-prompts.md`}
  />;
}
