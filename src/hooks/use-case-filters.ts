import { useMemo, useState } from "react";

import {
  CASE_CATEGORY_IDS,
  cases,
  pickLocalized,
  type CaseCategoryId,
  type CaseEntry,
} from "@/data/cases";

export type CategoryFilter = CaseCategoryId | "all";

/**
 * Search matches public display copy in both languages, so a creator can type
 * either "pottery" or "陶艺" regardless of the active UI language. The internal
 * sourceTitle is deliberately excluded from the index.
 */
const searchText = (entry: CaseEntry): string =>
  [...Object.values(entry.title), ...Object.values(entry.description)].join(" ").toLowerCase();

export const useCaseFilters = (
  entries: readonly CaseEntry[] = cases,
) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const normalizedQuery = query.trim().toLowerCase();
  const searchIndex = useMemo(() => entries.map(entry => ({ entry, text: searchText(entry) })), [entries]);

  const filteredCases = useMemo(() => searchIndex.filter(({ entry, text }) =>
    (category === "all" || entry.category === category) &&
    (normalizedQuery.length === 0 || text.includes(normalizedQuery)),
  ).map(({ entry }) => entry), [searchIndex, category, normalizedQuery]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryFilter, number>([["all", entries.length]]);
    for (const id of CASE_CATEGORY_IDS) counts.set(id, 0);
    for (const entry of entries) counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    return counts;
  }, [entries]);

  const isFiltered = normalizedQuery.length > 0 || category !== "all";

  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return {
    query,
    setQuery,
    category,
    setCategory,
    filteredCases,
    categoryCounts,
    isFiltered,
    reset,
    totalCount: entries.length,
  };
};

export const pickCaseTitle = (entry: CaseEntry, language: string) =>
  pickLocalized(entry.title, language);

export const pickCaseDescription = (entry: CaseEntry, language: string) =>
  pickLocalized(entry.description, language);
