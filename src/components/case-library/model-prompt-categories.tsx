import { useState } from "react";
import { Layers3 } from "lucide-react";
import type { ModelCategoryCopy, ModelPlaceholderCopy } from "@/data/model-pages/types";
import { ModelPromptPlaceholder } from "./model-prompt-placeholder";

type PromptCategory = "all" | "website" | "app" | "other";
type Props = { copy: ModelCategoryCopy; placeholderCopy: ModelPlaceholderCopy };

/** Show editorial card placeholders under All; categories remain empty until real prompts arrive. */
export function ModelPromptCategories({ copy, placeholderCopy }: Props) {
  const [category, setCategory] = useState<PromptCategory>("all");
  const categories: { id: PromptCategory; label: string }[] = [
    { id: "all", label: copy.all },
    { id: "website", label: copy.website },
    { id: "app", label: copy.app },
    { id: "other", label: copy.other },
  ];

  return (
    <div className="model-category-browser">
      <div className="model-category-tabs" role="group" aria-label={copy.label}>
        {categories.map(({ id, label }) => (
          <button key={id} type="button" className="model-category-tab" aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>
        ))}
      </div>
      {category === "all" ? (
        <div className="model-prompts-grid">
          {[1, 2, 3].map(number => <ModelPromptPlaceholder key={number} number={number} copy={placeholderCopy} />)}
        </div>
      ) : (
        <div className="model-collection-empty" role="status">
          <Layers3 size={25} strokeWidth={1.25} aria-hidden="true" />
          <p>{copy.empty}</p>
        </div>
      )}
    </div>
  );
}
