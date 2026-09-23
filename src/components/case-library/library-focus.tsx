import { ArrowDown, ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { libraryWindow } from "./library-window";

export type LibraryKind = "prompts" | "cases";

export function useLibraryFocus() {
  const [focus, setFocus] = useState<LibraryKind | null>(null);
  const activate = (kind: LibraryKind) => setFocus(kind);
  const switchTo = (kind: LibraryKind) => {
    setFocus(kind);
    requestAnimationFrame(() => {
      const heading = document.getElementById(`${kind}-heading`);
      heading?.scrollIntoView({ block: "start" });
      heading?.focus({ preventScroll: true });
    });
  };
  return { focus, activate, switchTo };
}

export function LibrarySwitch({ focus, onSwitch }: { focus: LibraryKind | null; onSwitch: (kind: LibraryKind) => void }) {
  const { t } = useTranslation();
  if (!focus) return null;
  const other = focus === "prompts" ? "cases" : "prompts";
  return <div className="library-switch"><LiquidButton type="button" flowingBorder onClick={() => onSwitch(other)}>
    <ArrowLeftRight aria-hidden="true" />{t(other === "prompts" ? "library.switchPrompts" : "library.switchCases")}
  </LiquidButton></div>;
}

export function useLibraryPage(total: number, focused: boolean) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  return { ...libraryWindow(total, expanded, focused, page),
    expand: () => { setExpanded(true); setPage(1); }, changePage: setPage, reset: () => { setExpanded(false); setPage(1); } };
}

export function LibraryMore({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return <div className="mt-10 flex justify-center"><LiquidButton type="button" size="lg" onClick={onClick}>
    {t("gallery.exploreMore")}<ArrowDown aria-hidden="true" />
  </LiquidButton></div>;
}

export function LibraryPagination({ current, pages, onChange }: { current: number; pages: number; onChange: (page: number) => void }) {
  const { t } = useTranslation();
  if (pages <= 1) return null;
  return <nav aria-label={t("common.page")} className="mt-10 flex items-center justify-center gap-4">
    <LiquidButton type="button" size="sm" disabled={current === 1} onClick={() => onChange(current - 1)}><ChevronLeft aria-hidden="true" />{t("common.previous")}</LiquidButton>
    <span role="status" className="text-sm tabular-nums text-muted-foreground">{t("common.page")} {current} / {pages}</span>
    <LiquidButton type="button" size="sm" disabled={current === pages} onClick={() => onChange(current + 1)}>{t("common.next")}<ChevronRight aria-hidden="true" /></LiquidButton>
  </nav>;
}
