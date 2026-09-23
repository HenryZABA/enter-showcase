import { ArrowUpRight, FileText, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Deliberately empty editorial slot: not a playable video or a published case. */
export function ModelPromptPlaceholder({ number }: { number: number }) {
  const { t } = useTranslation();
  return (
    <article className="model-prompt-card">
      <div className="model-card-media">
        <span className="model-pending-badge">{t("modelAstra.pending")}</span>
        <span className="model-card-number" aria-hidden="true">0{number}</span>
        <div className="model-video-placeholder"><span><Video size={26} strokeWidth={1.25} aria-hidden="true" /></span><p>{t("modelAstra.videoPending")}</p></div>
      </div>
      <div className="model-card-content">
        <h3>{t("modelAstra.casePending")}</h3>
        <p className="model-card-description">{t("modelAstra.cardDescription")}</p>
        <div className="model-card-prompt"><span><FileText size={14} aria-hidden="true" />{t("modelAstra.promptLabel")}</span><p>{t("modelAstra.promptPending")}</p></div>
        <button className="model-card-action" disabled type="button">{t("modelAstra.cardAction")}<ArrowUpRight size={16} aria-hidden="true" /></button>
        <p className="model-card-note">{t("modelAstra.cardNote")}</p>
      </div>
    </article>
  );
}
