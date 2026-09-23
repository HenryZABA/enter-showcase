import { ArrowUpRight, BookText, ChevronRight, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { pickLocalized } from "@/data/cases";
import type { TrendingPrompt } from "@/data/model-pages/trending-prompts";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { loadPrompt } from "@/lib/prompt-cache";
import { copyText } from "@/lib/prompt-file";
import { ViewportVideo } from "./viewport-video";

function TrendingPromptCard({ entry, onPrimaryAction }: { entry: TrendingPrompt; onPrimaryAction: () => void }) {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const [body, setBody] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const readBody = async () => {
    if (body !== null) return body;
    try {
      const text = await loadPrompt(entry.promptUrl);
      setBody(text);
      setFailed(false);
      return text;
    } catch {
      setFailed(true);
      throw new Error("Prompt unavailable");
    }
  };

  const handleCopy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const text = await readBody();
      if (!await copyText(text)) throw new Error("Clipboard unavailable");
      toast.success(t("common.copied"));
    } catch {
      toast.error(t("common.copyFailed"));
    } finally {
      setBusy(false);
    }
  };

  return <article className="model-trending-card">
    <button type="button" className="model-trending-primary" onClick={onPrimaryAction} aria-label={`${t("library.openPrompts")}: ${pickLocalized(entry.title, language)}`}>
      {entry.media?.type === "image" && <img className="model-trending-media" src={entry.media.src} alt="" width={1280} height={720} loading="lazy" decoding="async" />}
      {entry.media?.type === "video" && <ViewportVideo className="model-trending-media" src={entry.media.src} poster={entry.media.poster} />}
      <span className="model-trending-intro"><span className="model-trending-title">{pickLocalized(entry.title, language)}</span><span className="model-trending-description">{pickLocalized(entry.description, language)}</span></span>
    </button>
    <div className="model-trending-content">
      <span className="model-original-badge">{t("modelPages.originalPrompts")}</span>
      <p className="model-trending-source">{t("modelPages.source")} <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.sourceName}<ArrowUpRight size={13} aria-hidden="true" /></a></p>
      <details className="model-trending-disclosure" onToggle={event => {
        if (event.currentTarget.open) void readBody().catch(() => undefined);
      }}>
        <summary><ChevronRight size={16} aria-hidden="true" />{t("modelPages.readPrompt")}{body !== null && ` · ${body.length} ${t("modelPages.characters")}`}</summary>
        {body !== null ? <pre>{body}</pre> : <div role="status" className="model-trending-feedback">{failed ? <button type="button" onClick={() => void readBody().catch(() => undefined)}>{t("common.retry")}</button> : t("common.loading")}</div>}
      </details>
      <button type="button" className="model-action theme-primary-gradient model-trending-copy" onClick={() => void handleCopy()} disabled={busy} aria-busy={busy}>
        {busy ? <LoaderCircle className="model-copy-spinner" size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
        {t("modelPages.copyPrompt")}
      </button>
    </div>
  </article>;
}

export function ModelTrendingPrompts({ entries, onPrimaryAction }: { entries: readonly TrendingPrompt[]; onPrimaryAction: () => void }) {
  const { t } = useTranslation();
  if (entries.length === 0) return <div className="model-collection-empty" role="status"><BookText size={26} strokeWidth={1.25} aria-hidden="true" /><p>{t("modelPages.promptsEmpty")}</p></div>;
  return <div className="model-trending-grid">{entries.map(entry => <TrendingPromptCard key={entry.id} entry={entry} onPrimaryAction={onPrimaryAction} />)}</div>;
}
