import { useTranslation } from "react-i18next";

import { fallbackLng, normalizeLanguage } from "@/i18n/config";

/** Active language, normalized to a manifest code. */
export const useCurrentLanguage = (): string => {
  const { i18n } = useTranslation();
  return normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? fallbackLng;
};
