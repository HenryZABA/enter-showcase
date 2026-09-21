import { ArrowUpRight } from "lucide-react";
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

  return (
    <Link
      to={href}
      className="collection-directory-card"
      aria-label={copy.openLabel}
    >
      <div className="collection-directory-media">
        {collection.coverVideo ? (
          <video
            src={collection.coverVideo}
            poster={collection.coverImage}
            width={1280}
            height={720}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
          <span className="collection-directory-count">{t("collections.caseCount", { value: total })}</span>
        </div>
        <span className="collection-directory-arrow" aria-hidden="true"><ArrowUpRight size={24} /></span>
      </div>
    </Link>
  );
};
