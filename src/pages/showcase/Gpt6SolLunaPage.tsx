import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { ModelPromptPlaceholder } from "@/components/case-library/model-prompt-placeholder";
import { getSolLunaCopy, solLunaInitialPrompt, solLunaModel } from "@/data/model-pages/gpt-6-sol-luna";

export default function Gpt6SolLunaPage() {
  const { t } = useTranslation();
  const copy = getSolLunaCopy(t);
  const hotContent = (
    <div className="model-prompts-grid">
      {[1, 2, 3].map(number => <ModelPromptPlaceholder key={number} number={number} copy={copy.placeholder} />)}
    </div>
  );
  return <ModelDetailPage model={solLunaModel} copy={copy} initialPrompt={solLunaInitialPrompt} hotContent={hotContent} />;
}
