import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getShowcaseCollectionCases, type ShowcaseCollection } from "@/data/showcase-collections";

type CollectionCardProps = {
  collection: ShowcaseCollection;
  href: string;
  priority?: boolean;
};

export const CollectionCard = ({ collection, href, priority = false }: CollectionCardProps) => {
  const { t } = useTranslation();
  const copy = collection.getCopy(t);
  const total = getShowcaseCollectionCases(collection).length;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let visible = false;
    const resume = () => {
      if (document.hidden || !visible) {
        video.pause();
        return;
      }
      // Set both the property and attribute for inline autoplay in WebKit.
      video.muted = true;
      video.defaultMuted = true;
      void video.play().then(() => {
        if (disposed || !visible || document.hidden) video.pause();
        if (!disposed) setPlaybackBlocked(false);
      }).catch((error: unknown) => {
        if (!disposed && !(error instanceof DOMException && error.name === "AbortError")) {
          setPlaybackBlocked(true);
        }
      });
    };
    const nearby = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !collection.coverVideo) return;
      video.src = collection.coverVideo;
      video.load();
      nearby.disconnect();
    }, { rootMargin: "240px" });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    nearby.observe(video);
    observer.observe(video);
    video.addEventListener("loadeddata", resume);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    resume();
    return () => {
      disposed = true;
      nearby.disconnect();
      observer.disconnect();
      video.removeEventListener("loadeddata", resume);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      video.pause();
    };
  }, [collection.coverVideo]);

  const playPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().then(() => setPlaybackBlocked(false)).catch(() => setPlaybackBlocked(true));
  };

  return (
    <article className="collection-directory-card">
    <Link
      to={href}
      className="collection-directory-link"
      aria-label={collection.modelPagePath ? `${collection.displayName} — ${t("modelAstra.viewModel")}` : copy.openLabel}
    >
      <div className="collection-directory-media">
        {collection.coverVideo ? (
          <video
            ref={videoRef}
            poster={collection.coverImage}
            width={1280}
            height={720}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        ) : (
          <img
            src={collection.coverImage}
            alt=""
            width={1280}
            height={720}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            draggable={false}
          />
        )}
        <span className="collection-directory-badge">{t("collections.directoryEyebrow")}</span>
      </div>
      <div className="collection-directory-info">
        <div>
          <h2>{collection.displayName}</h2>
          <p>{copy.description}</p>
          <span className="collection-directory-count">{collection.modelPagePath ? t("modelAstra.viewModel") : t("collections.caseCount", { value: total })}</span>
        </div>
        <span className="collection-directory-arrow" aria-hidden="true"><ArrowUpRight size={24} /></span>
      </div>
    </Link>
    {playbackBlocked && (
      <LiquidButton
        type="button"
        size="sm"
        className="collection-directory-play"
        aria-label={t("collections.playCarousel")}
        title={t("collections.playCarousel")}
        onClick={playPreview}
      >
        <Play aria-hidden="true" />
      </LiquidButton>
    )}
    </article>
  );
};
