import type { Data } from "@enter-pro/cookie-management";

type ConsentValue = "granted" | "denied";
type Gtag = (...args: unknown[]) => void;
type GtmWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag };

const GTM_CONTAINER_ID = "GTM-TXJCNVLK";
const defaultConsent = {
  analytics_storage: "denied" as ConsentValue,
  ad_storage: "denied" as ConsentValue,
  ad_user_data: "denied" as ConsentValue,
  ad_personalization: "denied" as ConsentValue,
};
let defaultConsentSet = false;
let scriptInjected = false;

function ensureGtag(): Gtag {
  const target = window as GtmWindow;
  target.dataLayer ??= [];
  target.gtag ??= (...args: unknown[]) => target.dataLayer!.push(args);
  return target.gtag;
}

export function setDefaultGtmConsent(): void {
  if (typeof window === "undefined" || defaultConsentSet) return;
  ensureGtag()("consent", "default", defaultConsent);
  defaultConsentSet = true;
}

export function updateGtmConsent(data: Data): void {
  if (typeof window === "undefined") return;
  const analytics: ConsentValue = data.preference?.analytics === true ? "granted" : "denied";
  const advertising: ConsentValue = data.preference?.advertising === true ? "granted" : "denied";
  ensureGtag()("consent", "update", {
    analytics_storage: analytics,
    ad_storage: advertising,
    ad_user_data: advertising,
    ad_personalization: advertising,
  });
}

export function injectGtmScript(): void {
  if (typeof document === "undefined" || scriptInjected) return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}"]`)) {
    scriptInjected = true;
    return;
  }

  setDefaultGtmConsent();
  const target = window as GtmWindow;
  target.dataLayer ??= [];
  target.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);
  scriptInjected = true;
}
