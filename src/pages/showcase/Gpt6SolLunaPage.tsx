import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ModelDetailPage } from "@/components/case-library/model-detail-page";
import { getSolLunaCopy, solLunaInitialPrompt, solLunaModel } from "@/data/model-pages/gpt-6-sol-luna";

export default function Gpt6SolLunaPage() {
  const { t } = useTranslation();
  const copy = getSolLunaCopy(t);
  const hotContent = (
    <div className="model-collection-empty" role="status">
      <Sparkles size={25} strokeWidth={1.25} aria-hidden="true" />
      <p>{t("modelSolLuna.hotEmpty")}</p>
    </div>
  );
  return <ModelDetailPage model={solLunaModel} copy={copy} initialPrompt={solLunaInitialPrompt} hotContent={hotContent} />;
}
