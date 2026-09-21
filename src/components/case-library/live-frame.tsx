import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type LiveFrameProps = {
  url: string;
  title: string;
  poster?: string;
  enabled?: boolean;
  showExternalLink?: boolean;
  className?: string;
};

/** The local poster bridges the flip. Cross-origin load is not a paint signal. */
export const LiveFrame = ({ url, title, poster, enabled = true, showExternalLink = true, className }: LiveFrameProps) => {
  const { t } = useTranslation();
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [slowUrl, setSlowUrl] = useState<string | null>(null);
  const ready = loadedUrl === url;
  useEffect(() => {
    if (!enabled || ready) return;
    const timer = window.setTimeout(() => setSlowUrl(url), 12000);
    return () => window.clearTimeout(timer);
  }, [enabled, ready, url]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="media-frame relative aspect-[16/10] w-full">
        {poster && <img src={poster} alt="" width={1200} height={900} className="absolute inset-0 h-full w-full object-cover" />}
        {enabled && <iframe
          src={url} title={title} loading="eager" referrerPolicy="no-referrer"
          onLoad={() => setLoadedUrl(url)}
          className={cn("absolute inset-0 h-full w-full border-0 bg-card transition-opacity duration-150 motion-reduce:transition-none", ready ? "opacity-100" : "opacity-0")}
        />}
        {!ready && <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4">
          <span role="status" className="rounded-md bg-background/85 px-3 py-2 font-mono text-xs text-foreground">{t("live.loading")}</span>
        </div>}
      </div>
      <p aria-live="polite" className="sr-only">{ready ? t("live.ready") : ""}</p>
      {slowUrl === url && !ready && <p className="text-sm text-muted-foreground">{t("live.slow")}</p>}
      {showExternalLink && <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 self-start text-sm font-medium text-primary underline-offset-4 hover:underline">
        <ExternalLink aria-hidden="true" className="h-4 w-4" />{t("live.openPreview")}
      </a>}
    </div>
  );
};
