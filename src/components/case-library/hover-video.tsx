import { useEffect, useRef } from "react";
import { bindHoverVideo } from "@/lib/hover-video";

export function HoverVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) return bindHoverVideo(ref.current, src);
  }, [src]);
  return <video ref={ref} poster={poster} className={className} width={1280} height={720} muted loop playsInline preload="none" aria-hidden="true" />;
}
