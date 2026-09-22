import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

type Candidate = { node: HTMLElement; visible: boolean; update: (active: boolean) => void };
export function createPreviewBudget() {
  const candidates = new Set<Candidate>();
  let limit = 0;
  const reconcile = () => {
    let active = 0;
    for (const candidate of candidates) candidate.update(candidate.visible && active++ < limit);
  };
  return {
    setLimit(value: number) { limit = value; reconcile(); },
    register(node: HTMLElement, update: Candidate["update"]) {
      const candidate = { node, visible: false, update };
      candidates.add(candidate);
      const observer = new IntersectionObserver(([entry]) => {
        candidate.visible = entry.isIntersecting;
        reconcile();
      }, { threshold: 0.01 });
      observer.observe(node);
      return () => { observer.disconnect(); candidates.delete(candidate); reconcile(); };
    },
  };
}
const PreviewBudgetContext = createContext<ReturnType<typeof createPreviewBudget> | null>(null);

export function PreviewBudgetProvider({ paused, children }: { paused: boolean; children: ReactNode }) {
  const [budget] = useState(createPreviewBudget);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const update = () => budget.setLimit(paused || document.hidden ? 0 : mobile.matches ? 1 : 3);
    update();
    mobile.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => { mobile.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); budget.setLimit(0); };
  }, [budget, paused]);
  return <PreviewBudgetContext.Provider value={budget}>{children}</PreviewBudgetContext.Provider>;
}

export function usePreviewSlot(): [RefObject<HTMLDivElement | null>, boolean] {
  const root = useRef<HTMLDivElement>(null);
  const budget = useContext(PreviewBudgetContext);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!root.current || !budget) return;
    return budget.register(root.current, setActive);
  }, [budget]);
  return [root, active];
}
