import { useId, useState } from "react";
import { Download } from "lucide-react";
import type { ModelComposerCopy } from "@/data/model-pages/types";
import { DownloadPromptButton } from "./download-prompt-button";

type Props = { modelLabel: string; initialPrompt: string; copy: ModelComposerCopy };

export function ModelPromptComposer({ modelLabel, initialPrompt, copy }: Props) {
  const id = useId();
  const [prompt, setPrompt] = useState(initialPrompt);
  return <form className="model-composer mp-no-track mp-block" data-clarity-mask="true" onSubmit={event => event.preventDefault()}>
    <div className="model-composer-label"><label htmlFor={id}>{copy.label}</label><span aria-hidden="true">{modelLabel}</span></div>
    <textarea id={id} value={prompt} onChange={event => setPrompt(event.target.value)} rows={5} aria-describedby={`${id}-hint`} spellCheck={false} />
    <div className="model-composer-footer">
      <p id={`${id}-hint`}><Download size={13} aria-hidden="true" />{copy.hint}</p>
      <DownloadPromptButton title={modelLabel} promptText={prompt} promptKind="recreation" appearance="composer" className="model-action theme-primary-gradient" />
    </div>
  </form>;
}
