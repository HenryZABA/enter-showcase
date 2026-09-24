import { ArrowUpRight, BookText, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { pickLocalized } from "@/data/cases";
import type { TrendingPrompt } from "@/data/model-pages/trending-prompts";
import type { CaseFlipOrigin } from "@/hooks/use-case-flip";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { DownloadPromptButton } from "./download-prompt-button";
import { HoverVideo } from "./hover-video";
import { PromptDetailShell } from "./prompt-detail-shell";

type PromptDetail = { entry: TrendingPrompt; origin: CaseFlipOrigin; focusAfterClose: boolean };

function TrendingPromptCard({ entry, onOpen }: { entry: TrendingPrompt; onOpen: (detail: PromptDetail) => void }) {
  const { t } = useTranslation();
  const language = useCurrentLanguage();
  const source = useRef<HTMLElement>(null);
  const open = (trigger: HTMLElement, focusAfterClose: boolean) => {
    if (source.current) onOpen({ entry, origin: { source: source.current, trigger }, focusAfterClose });
  };
  const title = pickLocalized(entry.title, language);
  const intro = <><span className="model-trending-title">{title}</span><span className="model-trending-description">{pickLocalized(entry.description, language)}</span></>;
  const openLabel = `${t("library.openPrompts")}: ${title}`;
  return <article ref={source} className="model-trending-card">
    {entry.media?.type === "video" ? <div className="model-trending-primary">
      <HoverVideo className="model-trending-media" src={entry.media.src} poster={entry.media.poster} />
      <button type="button" className="model-trending-intro model-trending-title-button" onClick={event => open(event.currentTarget, true)} aria-label={openLabel}>{intro}</button>
    </div> : <button type="button" className="model-trending-primary" onClick={event => open(event.currentTarget, true)} aria-label={openLabel}>
      {entry.media?.type === "image" && <img className="model-trending-media" src={entry.media.src} alt="" width={1280} height={720} loading="lazy" decoding="async" />}
      <span className="model-trending-intro">{intro}</span>
    </button>}
    <div className="model-trending-content">
      <span className="model-original-badge">{t("modelPages.originalPrompts")}</span>
      <p className="model-trending-source">{t("modelPages.source")} <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">{entry.sourceName}<ArrowUpRight size={13} aria-hidden="true" /></a></p>
      <button type="button" className="model-trending-read" onClick={event => open(event.currentTarget, false)}><ChevronRight size={16} aria-hidden="true" />{t("modelPages.readPrompt")}</button>
      <DownloadPromptButton title={title} promptUrl={entry.promptUrl} promptKind="original" appearance="card" className="model-action theme-primary-gradient model-trending-download" />
    </div>
  </article>;
}

export function ModelTrendingPrompts({ entries, onPrimaryAction }: { entries: readonly TrendingPrompt[]; onPrimaryAction: () => void }) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState<PromptDetail | null>(null);
  const open = useCallback((next: PromptDetail) => setDetail(current => current ?? next), []);
  const close = useCallback(() => {
    setDetail(null);
    if (detail?.focusAfterClose) onPrimaryAction();
  }, [detail, onPrimaryAction]);
  if (entries.length === 0) return <div className="model-collection-empty" role="status"><BookText size={26} strokeWidth={1.25} aria-hidden="true" /><p>{t("modelPages.promptsEmpty")}</p></div>;
  return <>
    <div className="model-trending-grid">{entries.map(entry => <TrendingPromptCard key={entry.id} entry={entry} onOpen={open} />)}</div>
    {detail && <PromptDetailShell key={detail.entry.id} entry={detail.entry} origin={detail.origin} onClosed={close} />}
  </>;
}
