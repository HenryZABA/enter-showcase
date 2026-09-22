import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "xj39ml6cp1";
let initialized = false;

export function syncClarityConsent(
  analyticsAllowed: boolean,
  advertisingAllowed: boolean,
): void {
  if (!initialized) {
    Clarity.init(CLARITY_PROJECT_ID);
    initialized = true;
  }
  Clarity.consentV2({
    analytics_Storage: analyticsAllowed ? "granted" : "denied",
    ad_Storage: advertisingAllowed ? "granted" : "denied",
  });
}
