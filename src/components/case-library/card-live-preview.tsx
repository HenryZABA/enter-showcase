import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CaseCover } from "@/components/case-library/case-cover";
import type { CaseEntry } from "@/data/cases";
import { cn } from "@/lib/utils";
import { usePreviewSlot } from "./preview-budget";

type CardLivePreviewProps = {
  entry: CaseEntry;
  index: number;
  title: string;
};

/** Desktop canvas rendered inside every card, then uniformly scaled down. */
const PREVIEW_WIDTH = 1440;
const PREVIEW_HEIGHT = 900;

/**
 * A visual-only live project preview for gallery cards.
 *
 * The project always receives a 1440×900 desktop viewport. We then scale that
 * complete viewport uniformly into the 16:10 card frame, rather than letting
 * each project reflow for a tiny iframe. Scrolling is disabled because the card
 * is a visual preview; clicking the transparent overlay opens case details.
 */
export const CardLivePreview = ({
  entry,
  index,
  title,
}: CardLivePreviewProps) => {
  const { t } = useTranslation();
  const [rootRef, shouldMount] = usePreviewSlot();
  const slowTimerRef = useRef<number | null>(null);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const [slow, setSlow] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const updateScale = () => {
      const { width, height } = node.getBoundingClientRect();
      setScale(Math.min(width / PREVIEW_WIDTH, height / PREVIEW_HEIGHT));
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setReadyToReveal(false);
    setSlow(false);
    if (!shouldMount) return;
    slowTimerRef.current = window.setTimeout(() => setSlow(true), 12000);
    return () => {
      if (slowTimerRef.current !== null) window.clearTimeout(slowTimerRef.current);
    };
  }, [shouldMount, entry.previewUrl]);

  const handleLoad = () => {
    if (slowTimerRef.current !== null) window.clearTimeout(slowTimerRef.current);
    setSlow(false);
    setReadyToReveal(true);
  };

  return (
    <div
      ref={rootRef}
      className="relative aspect-[16/10] w-full overflow-hidden bg-card"
    >
      {shouldMount && (
        <iframe
          src={entry.previewUrl}
          title={`${title} — ${t("card.preview")}`}
          loading="eager"
          referrerPolicy="no-referrer"
          scrolling="no"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={handleLoad}
          style={{
            width: PREVIEW_WIDTH,
            height: PREVIEW_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="pointer-events-none absolute left-0 top-0 border-0 bg-card"
        />
      )}

      <CaseCover
        category={entry.category}
        index={index}
        className={cn(
          "absolute inset-0 z-10 h-full transition-opacity duration-300",
          shouldMount && readyToReveal && "pointer-events-none opacity-0",
        )}
      />

      {!readyToReveal && shouldMount && (
        <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-md border border-border bg-card/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {slow ? t("live.slow") : t("live.loading")}
        </span>
      )}
    </div>
  );
};
