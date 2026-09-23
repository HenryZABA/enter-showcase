import { useEffect, useRef } from "react";

/** Decorative card video: load nearby, play only while visible, keep the poster otherwise. */
export function ViewportVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let mounted = true;
    let nearby = false;
    let visible = false;
    let playing = false;

    const sync = () => {
      if (!nearby || !visible || document.hidden || reducedMotion.matches) {
        video.pause();
        return;
      }
      if (playing || !video.paused) return;
      playing = true;
      video.muted = true;
      video.defaultMuted = true;
      void video.play().then(() => {
        if (!mounted || !visible || document.hidden || reducedMotion.matches) video.pause();
      }).catch(() => {
        video.pause(); // Keep the real poster if autoplay is denied.
      }).finally(() => { playing = false; });
    };

    if (typeof IntersectionObserver === "undefined") {
      nearby = true;
      visible = true;
      video.src = src;
      video.load();
      sync();
    }
    const preloader = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || nearby) return;
      nearby = true;
      video.src = src;
      video.load();
      preloader?.disconnect();
      sync();
    }, { rootMargin: "240px" });
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    preloader?.observe(video);
    observer?.observe(video);
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pageshow", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      mounted = false;
      preloader?.disconnect();
      observer?.disconnect();
      video.removeEventListener("loadeddata", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pageshow", sync);
      reducedMotion.removeEventListener("change", sync);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  return <video ref={ref} poster={poster} className={className} width={1280} height={720} muted loop playsInline preload="none" aria-hidden="true" />;
}
