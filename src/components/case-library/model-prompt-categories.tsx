import { useState } from "react";
import { Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";

type PromptCategory = "all" | "website" | "app" | "other";

/** Category UI intentionally has no cards until real curated prompts are supplied. */
export function ModelPromptCategories() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<PromptCategory>("all");
  const categories: { id: PromptCategory; label: string }[] = [
    { id: "all", label: t("modelAstra.categoryAll") },
    { id: "website", label: t("modelAstra.categoryWebsite") },
    { id: "app", label: t("modelAstra.categoryApp") },
    { id: "other", label: t("modelAstra.categoryOther") },
  ];

  return (
    <div className="model-category-browser">
      <div className="model-category-tabs" role="group" aria-label={t("modelAstra.categoryLabel")}>
        {categories.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="model-category-tab"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >{label}</button>
        ))}
      </div>
      <div className="model-collection-empty" role="status">
        <Layers3 size={25} strokeWidth={1.25} aria-hidden="true" />
        <p>{category === "all" ? t("modelAstra.allEmpty") : t("modelAstra.categoryEmpty")}</p>
      </div>
    </div>
  );
}
