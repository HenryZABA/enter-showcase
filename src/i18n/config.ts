import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import {
  fallbackLng,
  getLanguageDirection,
  normalizeLanguage,
  supportedLngs,
} from "./util";

// Bundle the locale JSON directly into the JS so the app never has to fetch
// /locales/*.json over the network at first paint. The HTTP backend approach
// caused keys to render raw on production whenever the CDN or Cloudflare
// challenged the JSON request before the first frame.
import de from "../../public/locales/de.json";
import en from "../../public/locales/en.json";
import es from "../../public/locales/es.json";
import fr from "../../public/locales/fr.json";
import it from "../../public/locales/it.json";
import ja from "../../public/locales/ja.json";
import ko from "../../public/locales/ko.json";
import ptBR from "../../public/locales/pt-BR.json";
import ptPT from "../../public/locales/pt-PT.json";
import zhCN from "../../public/locales/zh-CN.json";
import zhTW from "../../public/locales/zh-TW.json";

export * from "./util";

const bundledResources: Record<string, { translation: Record<string, string> }> = {
  de: { translation: de as Record<string, string> },
  en: { translation: en as Record<string, string> },
  es: { translation: es as Record<string, string> },
  fr: { translation: fr as Record<string, string> },
  it: { translation: it as Record<string, string> },
  ja: { translation: ja as Record<string, string> },
  ko: { translation: ko as Record<string, string> },
  "pt-BR": { translation: ptBR as Record<string, string> },
  "pt-PT": { translation: ptPT as Record<string, string> },
  "zh-CN": { translation: zhCN as Record<string, string> },
  "zh-TW": { translation: zhTW as Record<string, string> },
};

// One-time migration: legacy localStorage('i18nextLng') with old 'cn' code -> i18next cookie.
// Runs once on bootstrap before i18next.init() so the detector picks the migrated cookie.
try {
  const legacy = typeof localStorage !== "undefined" ? localStorage.getItem("i18nextLng") : null;
  const hasCookie =
    typeof document !== "undefined" && /(?:^|;\s*)i18next=/.test(document.cookie);
  if (legacy && !hasCookie) {
    const mapped = legacy === "cn" ? "zh-CN" : legacy === "en" ? "en" : null;
    if (mapped) {
      document.cookie = `i18next=${mapped}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    localStorage.removeItem("i18nextLng");
  }
  // Drop the previous custom cookie if present; the template uses 'i18next' as the cookie name.
  const oldCookie = typeof document !== "undefined" && /(?:^|;\s*)enter_lang=/.test(document.cookie);
  if (oldCookie && !hasCookie) {
    const match = document.cookie.match(/(?:^|;\s*)enter_lang=([^;]+)/);
    if (match) {
      const mapped = match[1] === "cn" ? "zh-CN" : match[1];
      document.cookie = `i18next=${mapped}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    document.cookie = "enter_lang=; Path=/; Max-Age=0; SameSite=Lax";
  }
} catch {
  /* SSR / privacy mode — ignore */
}

export const i18nReady = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    supportedLngs,
    resources: bundledResources,
    detection: {
      // querystring (?hl=...) wins, then cookie, then browser, then html tag.
      order: ["querystring", "cookie", "navigator", "htmlTag"],
      lookupQuerystring: "hl",
      lookupCookie: "i18next",
      caches: ["cookie"],
      // Normalize unsupported languages (incl. legacy 'cn') to a manifest code,
      // otherwise fall back to fallbackLng.
      convertDetectedLanguage: (l) => normalizeLanguage(l) ?? fallbackLng,
    },
    // The current template uses flat dotted keys + a single namespace.
    // Both separators are disabled so the entire string is a literal key,
    // not split into ns/key/subkey.
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

const syncDocumentLanguage = (lng: string) => {
  const code = normalizeLanguage(lng) ?? fallbackLng;
  document.documentElement.lang = code;
  document.documentElement.dir = getLanguageDirection(code);
};

i18n.on("initialized", () =>
  syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language),
);
i18n.on("languageChanged", syncDocumentLanguage);

void i18nReady.then(() => syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language));

export default i18n;
