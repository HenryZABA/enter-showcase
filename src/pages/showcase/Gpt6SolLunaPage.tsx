import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { ModelHotPromptGallery } from "@/components/case-library/model-hot-prompt-gallery";
import { getSolLunaCopy, solLunaInitialPrompt, solLunaModel } from "@/data/model-pages/gpt-6-sol-luna";

export default function Gpt6SolLunaPage() {
  const { t } = useTranslation();
  return <ModelDetailPage model={solLunaModel} copy={getSolLunaCopy(t)} initialPrompt={solLunaInitialPrompt} hotContent={<ModelHotPromptGallery />} />;
}
