import rawConfig from "../../i18n.config.json";

export type LanguageDirection = "ltr" | "rtl";

export type LanguageConfig = {
  code: string;
  label: string;
  detect: string[];
  dir: LanguageDirection;
};

const config = rawConfig as {
  fallbackLng: string;
  languages: LanguageConfig[];
};

/** Fallback language code. Every locale file must hold the same key set. */
export const fallbackLng = config.fallbackLng;

/** All template-supported language codes; pass to i18next.supportedLngs. */
export const supportedLngs = config.languages.map((l) => l.code);

/**
 * Dropdown options used by the language switcher. value is the language code,
 * label is the display name from the manifest.
 * Single source of truth is i18n.config.json; do not declare a second list elsewhere.
 */
export const languageOptions = config.languages.map(({ code, label }) => ({
  value: code,
  label,
}));

const dirMap = new Map(config.languages.map((l) => [l.code, l.dir]));
const canonicalCodeMap = new Map(
  config.languages.map((language) => [language.code.toLowerCase(), language.code] as const),
);
const aliasMap = new Map(
  config.languages.flatMap((l) =>
    l.detect.map((alias) => [alias.toLowerCase(), l.code] as const),
  ),
);

/**
 * Normalize a language string from browser/cookie/htmlTag to a manifest-supported code.
 * Match rules: exact match first, then prefix match against detect aliases (zh -> zh-CN).
 * Returns null on miss; the caller decides whether to fall back to fallbackLng.
 */
export function normalizeLanguage(value?: string | null): string | null {
  if (!value) return null;
  const lowered = value.trim().toLowerCase();
  if (!lowered) return null;
  const canonicalCode = canonicalCodeMap.get(lowered);
  if (canonicalCode) return canonicalCode;
  for (const [alias, code] of aliasMap) {
    if (lowered === alias || lowered.startsWith(`${alias}-`)) return code;
  }
  return null;
}

/**
 * Get the html dir attribute value for a language. Unknown languages get the fallback's direction.
 * Used to sync documentElement.dir on init and on languageChanged.
 */
export function getLanguageDirection(value?: string | null): LanguageDirection {
  return dirMap.get(normalizeLanguage(value) ?? fallbackLng) ?? "ltr";
}
