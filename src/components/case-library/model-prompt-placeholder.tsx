import { ArrowUpRight, FileText, Video } from "lucide-react";
import type { ModelPlaceholderCopy } from "@/data/model-pages/types";

export function ModelPromptPlaceholder({ number, copy }: { number: number; copy: ModelPlaceholderCopy }) {
  return (
    <article className="model-prompt-card">
      <div className="model-card-media">
        <span className="model-pending-badge">{copy.pending}</span>
        <span className="model-card-number" aria-hidden="true">0{number}</span>
        <div className="model-video-placeholder"><span><Video size={26} strokeWidth={1.25} aria-hidden="true" /></span><p>{copy.videoPending}</p></div>
      </div>
      <div className="model-card-content">
        <h3>{copy.casePending}</h3>
        <p className="model-card-description">{copy.cardDescription}</p>
        <div className="model-card-prompt"><span><FileText size={14} aria-hidden="true" />{copy.promptLabel}</span><p>{copy.promptPending}</p></div>
        <button className="model-card-action" disabled type="button">{copy.cardAction}<ArrowUpRight size={16} aria-hidden="true" /></button>
        <p className="model-card-note">{copy.cardNote}</p>
      </div>
    </article>
  );
}
