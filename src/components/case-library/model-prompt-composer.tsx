import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { copyPromptAndOpenEnter } from "@/lib/model-prompt-action";

const initialPrompt = "Build a responsive project dashboard where I can create projects, assign tasks, track progress, and filter work by status. Add a clean overview with deadlines, priorities, and a dark mode toggle.";

export function ModelPromptComposer() {
  const { t } = useTranslation();
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
        navigate: url => window.location.assign(url),
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
      <div className="model-composer-label"><label htmlFor={id}>{t("modelAstra.composerLabel")}</label><span aria-hidden="true">GPT-6 ASTRA</span></div>
      <textarea id={id} value={prompt} onChange={event => { setPrompt(event.target.value); setFailed(false); }} rows={5} disabled={busy} aria-describedby={`${id}-hint${failed ? ` ${id}-error` : ""}`} spellCheck={false} />
      <div className="model-composer-footer">
        <p id={`${id}-hint`}><Copy size={13} aria-hidden="true" />{t("modelAstra.composerHint")}</p>
        <button className="model-action theme-primary-gradient" type="submit" disabled={busy || !prompt.trim()} aria-busy={busy}>
          {busy ? t("modelAstra.copying") : t("modelAstra.copyOpen")}
          {busy ? <LoaderCircle className="model-copy-spinner" size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
        </button>
      </div>
      {failed && <p className="model-composer-error" id={`${id}-error`} role="alert">{t("modelAstra.copyError")}</p>}
    </form>
  );
}
