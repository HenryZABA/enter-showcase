export type VideoPreviewState = "idle" | "loading" | "playing" | "error";

/** Bind to the visible cover button, not the nested decorative video element. */
export function bindHoverVideo(video: HTMLVideoElement, src: string, options: {
  target?: HTMLElement;
  onStateChange?: (state: VideoPreviewState) => void;
} = {}) {
  const target = options.target ?? video;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = false;
  let generation = 0;
  let state: VideoPreviewState = "idle";
  const update = (next: VideoPreviewState) => { state = next; options.onStateChange?.(next); };
  const reset = (next: VideoPreviewState = "idle") => {
    active = false;
    generation += 1;
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    update(next);
  };
  const stop = () => reset();
  const start = () => {
    if (document.hidden || active) return;
    active = true;
    const request = ++generation;
    update("loading");
    video.muted = true;
    video.defaultMuted = true;
    video.src = src;
    video.load();
    void video.play().then(() => {
      if (!active) video.pause();
      else if (request === generation) update("playing");
    }).catch(() => {
      if (request === generation) reset("error");
    });
  };
  const enter = (event: PointerEvent) => {
    // The actual input event is authoritative, even on hybrid devices or iframes
    // whose primary-pointer media query reports coarse/no hover.
    if (event.pointerType !== "mouse" || reducedMotion.matches) return;
    start();
  };
  const leave = (event: PointerEvent) => { if (event.pointerType === "mouse") stop(); };
  const click = (event: Event) => {
    event.stopPropagation();
    if (state === "playing") stop();
    else start(); // Explicit activation is allowed with reduced motion and touch.
  };
  const error = () => reset("error");
  const visibility = () => { if (document.hidden) stop(); };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
  });
  observer?.observe(target);
  target.addEventListener("pointerenter", enter);
  target.addEventListener("pointerleave", leave);
  target.addEventListener("click", click);
  video.addEventListener("error", error);
  document.addEventListener("visibilitychange", visibility);
  reducedMotion.addEventListener("change", stop);

  return () => {
    observer?.disconnect();
    target.removeEventListener("pointerenter", enter);
    target.removeEventListener("pointerleave", leave);
    target.removeEventListener("click", click);
    video.removeEventListener("error", error);
    document.removeEventListener("visibilitychange", visibility);
    reducedMotion.removeEventListener("change", stop);
    stop();
  };
}
