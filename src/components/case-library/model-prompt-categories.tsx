import { useState } from "react";
import { Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ModelPromptPlaceholder } from "./model-prompt-placeholder";

type PromptCategory = "all" | "website" | "app" | "other";

/** Show editorial card placeholders under All; categories remain empty until real prompts arrive. */
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
      {category === "all" ? (
        <div className="model-prompts-grid">
          {[1, 2, 3].map(number => <ModelPromptPlaceholder key={number} number={number} />)}
        </div>
      ) : (
        <div className="model-collection-empty" role="status">
          <Layers3 size={25} strokeWidth={1.25} aria-hidden="true" />
          <p>{t("modelAstra.categoryEmpty")}</p>
        </div>
      )}
    </div>
  );
}
