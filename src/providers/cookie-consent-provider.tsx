import {
  SUPPORTED_LANGUAGES,
  cookieManager,
  type Data,
  type SupportedLanguage,
} from "@enter-pro/cookie-management";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useCurrentLanguage } from "@/hooks/use-current-language";
import { fallbackLng, normalizeLanguage } from "@/i18n/config";

type CookieConsentContextValue = {
  isReady: boolean;
  data: Data | null;
  analyticsAllowed: boolean;
  advertisingAllowed: boolean;
  openPreferenceCenter: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue>({
  isReady: false,
  data: null,
  analyticsAllowed: false,
  advertisingAllowed: false,
  openPreferenceCenter: () => undefined,
});

const languageFamilyFallbacks: Record<string, SupportedLanguage> = {
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-BR",
  zh: "zh-CN",
};

function toCookieLocale(language: string): SupportedLanguage {
  const normalized = normalizeLanguage(language) ?? normalizeLanguage(fallbackLng) ?? "en";
  const exact = SUPPORTED_LANGUAGES.find(
    (candidate) => candidate.toLowerCase() === normalized.toLowerCase(),
  );
  if (exact) return exact;
  return languageFamilyFallbacks[normalized.split("-")[0].toLowerCase()] ?? "en";
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const language = useCurrentLanguage();
  const locale = toCookieLocale(language);
  const [data, setData] = useState<Data | null>(null);
  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);
  const initialOptionsRef = useRef({
    locale,
    theme: "light" as const,
    useHostDesignTokens: false,
  });

  useEffect(() => {
    let active = true;
    let receivedData = false;
    const syncData = (nextData: Data | null) => {
      if (!active || !nextData) return;
      receivedData = true;
      setData(nextData);
      setIsReady(true);
    };
    const unsubscribe = cookieManager.onDataChange(syncData);

    void cookieManager
      .init(initialOptionsRef.current)
      .then(() => {
        initializedRef.current = true;
        if (!receivedData) syncData(cookieManager.getData());
      })
      .catch((error) => console.error("[cookie-consent] init error", error));

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initializedRef.current) return;
    cookieManager.update({ locale, theme: "light" });
  }, [locale]);

  const openPreferenceCenter = useCallback(() => cookieManager.openPreferenceCenter(), []);
  const value = useMemo<CookieConsentContextValue>(
    () => ({
      isReady,
      data,
      analyticsAllowed: data?.preference?.analytics === true,
      advertisingAllowed: data?.preference?.advertising === true,
      openPreferenceCenter,
    }),
    [data, isReady, openPreferenceCenter],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  return useContext(CookieConsentContext);
}
