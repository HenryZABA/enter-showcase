import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { getOpusCopy, opusModel } from "@/data/model-pages/claude-opus-5-5";
import { claudeOpus55Collection } from "@/data/showcase-collections/claude-opus-5-5";

export default function ClaudeOpus55Page() {
  const { t } = useTranslation();
  return <ModelDetailPage model={opusModel} collection={claudeOpus55Collection} copy={getOpusCopy(t)} />;
}
