import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { CASE_CATEGORY_IDS } from "@/data/cases";
import type { CategoryFilter } from "@/hooks/use-case-filters";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  categoryCounts: Map<CategoryFilter, number>;
};

export const FilterBar = ({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categoryCounts,
}: FilterBarProps) => {
  const { t } = useTranslation();

  const labelFor = (id: CategoryFilter) => {
    if (id === "all") return t("category.all");
    if (id === "interactive3d") return t("category.interactive3d");
    if (id === "business") return t("category.business");
    return t("category.creative");
  };

  const options: CategoryFilter[] = ["all", ...CASE_CATEGORY_IDS];

  return (
    <div className="rounded-md border border-border/70 bg-card/75 p-3 shadow-panel backdrop-blur sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            aria-label={t("gallery.searchLabel")}
            placeholder={t("gallery.searchPlaceholder")}
            className="h-11 border-border bg-background/60 pl-9 pr-10"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label={t("gallery.clearSearch")}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label={t("gallery.filterLabel")}
          className="flex flex-wrap gap-2"
        >
          {options.map((id) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onCategoryChange(id)}
                aria-pressed={active}
                className={cn(
                  "prism-button prism-button-soft inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-[border-color,background-color,color,box-shadow] shadow-[inset_0_1px_0_hsl(var(--foreground)/0.08)]",
                  active
                    ? "border-foreground/80 bg-foreground/[0.045] text-foreground"
                    : "border-foreground/12 bg-foreground/[0.045] text-muted-foreground hover:border-foreground/25 hover:bg-foreground/[0.08] hover:text-foreground",
                )}
              >
                {labelFor(id)}
                <span className="font-mono text-[10px] opacity-70">
                  {categoryCounts.get(id) ?? 0}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
