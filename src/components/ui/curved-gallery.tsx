import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CurvedGalleryItem } from "@/data/curved-gallery";
import { CurvedGalleryRenderer } from "@/lib/curved-gallery/renderer";
import "@/styles/curved-gallery.css";

type CurvedGalleryProps = { items: CurvedGalleryItem[]; label: string; paused?: boolean };

export function CurvedGallery({ items, label, paused = false }: CurvedGalleryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CurvedGalleryRenderer | null>(null);
  const pausedRef = useRef(paused);
  const navigate = useNavigate();
  const [fallback, setFallback] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useLayoutEffect(() => {
    pausedRef.current = paused;
    rendererRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || fallback) return;
    let renderer: CurvedGalleryRenderer | undefined;
    try {
      renderer = new CurvedGalleryRenderer({
        canvas: canvasRef.current, items, reducedMotion,
        onFallback: () => setFallback(true),
        onNavigate: href => { void navigate(href); },
      });
      rendererRef.current = renderer;
      renderer.setPaused(pausedRef.current);
    } catch {
      setFallback(true);
    }
    return () => { renderer?.destroy(); rendererRef.current = null; };
  }, [items, reducedMotion, fallback, navigate]);

  return (
    <section className="curved-gallery" aria-label={label}>
      {fallback ? (
        <div className="curved-gallery-fallback" data-testid="curved-gallery-fallback">
          {items.map(item => {
            const content = <>
              <img draggable={false} src={item.poster || item.src} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
              {item.title && <figcaption><span>{item.title}</span>{item.subtitle && <small>{item.subtitle}</small>}</figcaption>}
            </>;
            return <figure key={item.id} data-status={item.status}>
              {content}
              {item.href && <Link draggable={false} className="curved-gallery-fallback-link" to={item.href} aria-label={[item.title, item.subtitle].filter(Boolean).join(" — ")} />}
            </figure>;
          })}
        </div>
      ) : <div className="curved-gallery-viewport"><canvas ref={canvasRef} tabIndex={0} aria-label={label} /></div>}
      {!fallback && <ul className="curved-gallery-links sr-only">
        {items.filter(item => item.href).map(item => <li key={item.id}>
          <Link to={item.href!}>{item.title}{item.subtitle ? ` — ${item.subtitle}` : ""}</Link>
        </li>)}
      </ul>}
    </section>
  );
}
