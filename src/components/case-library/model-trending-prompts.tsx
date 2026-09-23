import { ArrowUpRight, BookText, ChevronRight, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { pickLocalized } from "@/data/cases";
import type { TrendingPrompt } from "@/data/model-pages/trending-prompts";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { loadPrompt } from "@/lib/prompt-cache";
import { copyText } from "@/lib/prompt-file";

function TrendingPromptCard({ entry }: { entry: TrendingPrompt }) {
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
    {entry.mediaUrl && <img className="model-trending-media" src={entry.mediaUrl} alt="" width={1280} height={720} loading="lazy" decoding="async" />}
    <div className="model-trending-content">
      <h3>{pickLocalized(entry.title, language)}</h3>
      <p className="model-trending-description">{pickLocalized(entry.description, language)}</p>
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

export function ModelTrendingPrompts({ entries }: { entries: readonly TrendingPrompt[] }) {
  const { t } = useTranslation();
  if (entries.length === 0) return <div className="model-collection-empty" role="status"><BookText size={26} strokeWidth={1.25} aria-hidden="true" /><p>{t("modelPages.promptsEmpty")}</p></div>;
  return <div className="model-trending-grid">{entries.map(entry => <TrendingPromptCard key={entry.id} entry={entry} />)}</div>;
}
