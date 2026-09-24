/** No media request until mouse hover. Resetting the source restores the poster. */
export function bindHoverVideo(video: HTMLVideoElement, src: string) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = false;
  let generation = 0;

  const stop = () => {
    active = false;
    generation += 1;
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
  };
  const enter = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !finePointer.matches || reducedMotion.matches || document.hidden || active) return;
    active = true;
    const request = ++generation;
    video.muted = true;
    video.defaultMuted = true;
    video.src = src;
    video.load();
    void video.play().then(() => {
      if (!active) video.pause();
    }).catch(() => {
      // A cancelled earlier request must not stop a newer hover session.
      if (request === generation) stop();
    });
  };
  const visibility = () => { if (document.hidden) stop(); };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
  });
  observer?.observe(video);
  video.addEventListener("pointerenter", enter);
  video.addEventListener("pointerleave", stop);
  video.addEventListener("error", stop);
  document.addEventListener("visibilitychange", visibility);
  finePointer.addEventListener("change", stop);
  reducedMotion.addEventListener("change", stop);

  return () => {
    observer?.disconnect();
    video.removeEventListener("pointerenter", enter);
    video.removeEventListener("pointerleave", stop);
    video.removeEventListener("error", stop);
    document.removeEventListener("visibilitychange", visibility);
    finePointer.removeEventListener("change", stop);
    reducedMotion.removeEventListener("change", stop);
    stop();
  };
}
