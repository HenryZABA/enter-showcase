import { AlertCircle, LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { bindHoverVideo, type VideoPreviewState } from "@/lib/hover-video";
import "@/styles/hover-video.css";

export function HoverVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<VideoPreviewState>("idle");
  const { t } = useTranslation();
  useEffect(() => {
    if (ref.current && button.current) return bindHoverVideo(ref.current, src, { target: button.current, onStateChange: setState });
  }, [src]);
  const label = state === "playing" ? t("video.pause") : state === "error" ? t("video.retry") : t("video.play");
  return <button ref={button} type="button" className={`${className ?? ""} hover-video`} aria-label={label} aria-pressed={state === "playing"} aria-busy={state === "loading"} data-state={state}>
    <video ref={ref} poster={poster} crossOrigin="anonymous" width={1280} height={720} muted loop playsInline preload="none" aria-hidden="true" />
    <span className="hover-video-badge" aria-hidden="true">
      {state === "loading" ? <LoaderCircle className="hover-video-spinner" size={14} /> : state === "playing" ? <Pause size={14} /> : state === "error" ? <AlertCircle size={14} /> : <Play size={14} />}
      {state === "loading" ? t("common.loading") : state === "error" ? t("video.retry") : state === "playing" ? t("video.pause") : t("video.label")}
    </span>
    <span className="sr-only" role="status">{state === "error" ? t("video.retry") : ""}</span>
  </button>;
}
