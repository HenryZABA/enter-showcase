import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { gpt6AstraCollection } from "@/data/showcase-collections/gpt-6-astra";
import { astraInitialPrompt, astraModel, getAstraCopy } from "@/data/model-pages/gpt-6-astra";

export default function Gpt6AstraPage() {
  const { t } = useTranslation();
  return <ModelDetailPage model={astraModel} copy={getAstraCopy(t)} initialPrompt={astraInitialPrompt} collection={gpt6AstraCollection} />;
}
