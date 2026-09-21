import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CurvedGallery } from "@/components/ui/curved-gallery";
import { curvedGalleryItems } from "@/data/curved-gallery";
import { getShowcaseCollection, getShowcaseCollectionCases } from "@/data/showcase-collections";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { normalizeLanguage } from "@/i18n/util";

export function CollectionCarousel({ paused = false }: { paused?: boolean }) {
  const { t } = useTranslation();
  const currentLanguage = useCurrentLanguage();
  const { search } = useLocation();
  // Preserve all configured locale codes even when a legacy header hook normalizes its own copy.
  const language = normalizeLanguage(new URLSearchParams(search).get("hl")) ?? currentLanguage;
  const items = useMemo(() => curvedGalleryItems.map(item => {
    if (item.status === "decorative") return { ...item, title: t("collections.comingSoon", { lng: "en" }) };
    const collection = getShowcaseCollection(item.id);
    const query = new URLSearchParams({ hl: language });
    return {
      ...item,
      subtitle: t("collections.caseCount", { lng: language, value: collection ? getShowcaseCollectionCases(collection).length : 0 }),
      href: item.href ? `${item.href}?${query}` : undefined,
    };
  }), [t, language]);
  return <CurvedGallery items={items} label={t("collections.sectionTitle")} paused={paused} />;
}
