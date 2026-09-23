import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { gpt6SolLunaCollection } from "@/data/showcase-collections/gpt-6-sol-luna";
import { getSolLunaCopy, solLunaInitialPrompt, solLunaModel } from "@/data/model-pages/gpt-6-sol-luna";

export default function Gpt6SolLunaPage() {
  const { t } = useTranslation();
  return <ModelDetailPage model={solLunaModel} copy={getSolLunaCopy(t)} initialPrompt={solLunaInitialPrompt} collection={gpt6SolLunaCollection} />;
}
