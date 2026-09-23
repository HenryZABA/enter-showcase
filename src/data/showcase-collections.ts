import { cases, type CaseEntry } from "@/data/cases";
import { gpt6AstraCollection } from "./showcase-collections/gpt-6-astra";
import { gpt6SolLunaCollection } from "./showcase-collections/gpt-6-sol-luna";
import type { ShowcaseCollection } from "./showcase-collections/types";

export type { ShowcaseCollection, ShowcaseHeroContent } from "./showcase-collections/types";

export const showcaseCollections: readonly ShowcaseCollection[] = [gpt6AstraCollection, gpt6SolLunaCollection];
export const featuredShowcaseCollection = showcaseCollections[0];

export const getShowcaseCollection = (slug: string) =>
  showcaseCollections.find((collection) => collection.slug === slug) ?? null;

export const showcaseCollectionHref = (collection: ShowcaseCollection) =>
  collection.modelPagePath ?? `/showcases/collections/${collection.slug}`;

/** Explicit membership prevents new Showcase entries from joining older collections. */
export function getShowcaseCollectionCases(collection: ShowcaseCollection, catalog: readonly CaseEntry[] = cases) {
  const byId = new Map(catalog.map(entry => [entry.id, entry]));
  return collection.caseIds.flatMap(id => {
    const entry = byId.get(id);
    return entry ? [entry] : [];
  });
}
