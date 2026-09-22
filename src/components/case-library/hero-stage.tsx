import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import type { ShowcaseHeroContent } from "@/data/showcase-collections";

type HeroStageProps = {
  content: ShowcaseHeroContent;
  collectionHref?: string;
  blended?: boolean;
};

export const HeroStage = ({ content, collectionHref, blended = false }: HeroStageProps) => {
  const { t } = useTranslation();

  return (
    <section className={`ambient-section relative isolate overflow-hidden ${blended ? "showcase-hero-blended" : "border-b border-border/60"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={content.image}
          srcSet={content.imageSrcSet}
          sizes="100vw"
          width={content.imageWidth}
          height={content.imageHeight}
          fetchPriority="high"
          decoding="async"
          alt=""
          className="h-full w-full object-cover object-center opacity-70"
        />
        <div className={`absolute inset-0 ${blended ? "showcase-hero-blend-overlay" : "bg-[linear-gradient(180deg,hsl(var(--background)/0.48)_0%,hsl(var(--background)/0.18)_48%,hsl(var(--background)/0.78)_100%)]"}`} />
      </div>

      <div className="container flex min-h-[320px] items-center justify-center py-10 sm:py-12 lg:py-14">
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            {content.eyebrow}
          </p>

          <h1 className="showcase-hero-title mx-auto mt-4 max-w-4xl font-display text-3xl font-semibold uppercase leading-[1.02] tracking-[-0.05em] text-foreground sm:text-4xl lg:text-[3.15rem]">
            {content.titleLine1}
            <span className="mt-1 block text-foreground/75">
              {content.titleLine2}
            </span>
          </h1>

          <Button asChild className="theme-primary-gradient mt-6 h-11 rounded-lg border-0 px-7 font-medium hover:bg-transparent">
            {collectionHref ? (
              <Link to={collectionHref}>{t("collections.exploreCollection")}</Link>
            ) : (
              <a
                href="https://enter.converge.ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("hero.buildInEnter")}
              </a>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};
