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
const matchesQuery = (entry: CaseEntry, query: string): boolean => {
  const haystack = [
    ...Object.values(entry.title),
    ...Object.values(entry.description),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

export const useCaseFilters = (
  entries: readonly CaseEntry[] = cases,
) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCases = useMemo(() => entries.filter((entry) => {
    const categoryMatch = category === "all" || entry.category === category;
    const queryMatch = normalizedQuery.length === 0 || matchesQuery(entry, normalizedQuery);
    return categoryMatch && queryMatch;
  }), [entries, category, normalizedQuery]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryFilter, number>([["all", entries.length]]);
    for (const id of CASE_CATEGORY_IDS) {
      counts.set(id, entries.filter((entry) => entry.category === id).length);
    }
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
