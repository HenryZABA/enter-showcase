import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, LoaderCircle } from "lucide-react";
import type { ModelComposerCopy } from "@/data/model-pages/types";
import { copyPromptAndOpenEnter, openEnter } from "@/lib/model-prompt-action";

type Props = { modelLabel: string; initialPrompt: string; copy: ModelComposerCopy };

export function ModelPromptComposer({ modelLabel, initialPrompt, copy }: Props) {
  const id = useId();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || !prompt.trim()) return;
    inFlight.current = true;
    setBusy(true);
    setFailed(false);
    try {
      await copyPromptAndOpenEnter(prompt, {
        copy: text => navigator.clipboard.writeText(text),
        navigate: openEnter,
      });
    } catch {
      setFailed(true);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <form className="model-composer mp-no-track mp-block" data-clarity-mask="true" onSubmit={submit}>
      <div className="model-composer-label"><label htmlFor={id}>{copy.label}</label><span aria-hidden="true">{modelLabel}</span></div>
      <textarea id={id} value={prompt} onChange={event => { setPrompt(event.target.value); setFailed(false); }} rows={5} disabled={busy} aria-describedby={`${id}-hint${failed ? ` ${id}-error` : ""}`} spellCheck={false} />
      <div className="model-composer-footer">
        <p id={`${id}-hint`}><Copy size={13} aria-hidden="true" />{copy.hint}</p>
        <button className="model-action theme-primary-gradient" type="submit" disabled={busy || !prompt.trim()} aria-busy={busy}>
          {busy ? copy.copying : copy.copyOpen}
          {busy ? <LoaderCircle className="model-copy-spinner" size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
        </button>
      </div>
      {failed && <p className="model-composer-error" id={`${id}-error`} role="alert">{copy.copyError}</p>}
    </form>
  );
}
