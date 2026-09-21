import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type CaseFlipOrigin = {
  source: HTMLElement;
  trigger: HTMLElement;
};

type FlipPhase = "opening-front" | "opening-back" | "open" | "closing-back" | "closing-front";

const HALF_TURN_MS = 220;

const measureTarget = () => {
  const width = Math.min(768, window.innerWidth - 32);
  const height = Math.min(820, window.innerHeight - 48);
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
};

/** Animate the existing card, not a clone of its cross-origin iframe. */
export const useCaseFlip = (origin: CaseFlipOrigin, onClosed: () => void) => {
  const [phase, setPhase] = useState<FlipPhase>("opening-front");
  const phaseRef = useRef<FlipPhase>("opening-front");
  const [target, setTarget] = useState(measureTarget);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const animationRef = useRef<Animation | null>(null);
  const restoreRef = useRef<() => void>(() => {});
  const closeRef = useRef<() => void>(() => {});

  const changePhase = useCallback((next: FlipPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const finish = useCallback(() => {
    animationRef.current?.cancel();
    restoreRef.current();
    onClosed();
  }, [onClosed]);

  const sourceKeyframes = useCallback(() => {
    const rect = origin.source.getBoundingClientRect();
    const destination = measureTarget();
    const dx = destination.left + destination.width / 2 - rect.left - rect.width / 2;
    const dy = destination.top + destination.height / 2 - rect.top - rect.height / 2;
    const scaleX = destination.width / Math.max(1, rect.width);
    const scaleY = destination.height / Math.max(1, rect.height);
    return [
      { transform: "perspective(1400px) translate3d(0, 0, 0) rotateY(0deg) scale(1, 1)" },
      { transform: `perspective(1400px) translate3d(${dx}px, ${dy}px, 0) rotateY(90deg) scale(${scaleX}, ${scaleY})` },
    ];
  }, [origin.source]);

  const returnFront = useCallback(() => {
    changePhase("closing-front");
    const source = origin.source;
    if (reducedMotion || !source.isConnected || typeof source.animate !== "function") {
      finish();
      return;
    }

    // Read the untransformed source position again in case the viewport changed.
    animationRef.current?.cancel();
    const keyframes = sourceKeyframes();
    source.closest("section")?.setAttribute("data-flip-front", "true");
    const animation = source.animate(keyframes.slice().reverse(), {
      duration: HALF_TURN_MS,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    });
    source.style.visibility = "visible";
    animationRef.current = animation;
    animation.onfinish = finish;
  }, [changePhase, finish, origin.source, reducedMotion, sourceKeyframes]);

  const requestClose = useCallback(() => {
    const current = phaseRef.current;
    if (current === "closing-front" || current === "closing-back") return;
    if (current === "opening-front" && animationRef.current) {
      changePhase("closing-front");
      animationRef.current.onfinish = finish;
      animationRef.current.reverse();
      return;
    }
    changePhase("closing-back");
  }, [changePhase, finish]);

  useLayoutEffect(() => {
    closeRef.current = requestClose;
  }, [requestClose]);

  useLayoutEffect(() => {
    const source = origin.source;
    const root = document.getElementById("root");
    const html = document.documentElement;
    const section = source.closest("section");
    const originalVisibility = source.style.visibility;
    const originalOverflow = html.style.overflow;
    const originalGutter = html.style.scrollbarGutter;
    const originalInert = root?.inert ?? false;

    // Batch geometry reads before any scroll-lock or source-style writes.
    const openingKeyframes = sourceKeyframes();
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    if (root) root.inert = true;
    source.setAttribute("data-flip-source", "true");
    section?.setAttribute("data-flip-front", "true");

    const restore = () => {
      source.removeAttribute("data-flip-source");
      section?.removeAttribute("data-flip-front");
      source.style.visibility = originalVisibility;
      html.style.overflow = originalOverflow;
      html.style.scrollbarGutter = originalGutter;
      if (root) root.inert = originalInert;
    };
    restoreRef.current = restore;

    const revealBack = () => {
      source.style.visibility = "hidden";
      animationRef.current?.cancel();
      section?.removeAttribute("data-flip-front");
      changePhase("opening-back");
    };

    if (reducedMotion || typeof source.animate !== "function") {
      revealBack();
    } else {
      const animation = source.animate(openingKeyframes, {
        duration: HALF_TURN_MS,
        easing: "cubic-bezier(0.3, 0.15, 0.7, 0.5)",
        fill: "both",
      });
      animationRef.current = animation;
      animation.onfinish = revealBack;
    }

    const onResize = () => setTarget(measureTarget());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      animationRef.current?.cancel();
      restore();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      // Restore in this cleanup, not a later frame that could steal focus from
      // the next card during rapid close/reopen interactions.
      if (origin.trigger.isConnected) origin.trigger.focus({ preventScroll: true });
    };
  }, [changePhase, origin.source, origin.trigger, reducedMotion, sourceKeyframes]);

  const onBackAnimationComplete = () => {
    if (phaseRef.current === "opening-back") changePhase("open");
    else if (phaseRef.current === "closing-back") returnFront();
  };

  return { phase, target, reducedMotion, requestClose, onBackAnimationComplete };
};
