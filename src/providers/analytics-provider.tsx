import { useEffect, type ReactNode } from "react";

import { syncClarityConsent } from "@/lib/analytics/clarity";
import { injectGtmScript, setDefaultGtmConsent, updateGtmConsent } from "@/lib/analytics/gtm";
import { syncMixpanelConsent } from "@/lib/analytics/mixpanel";
import { useCookieConsent } from "@/providers/cookie-consent-provider";

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { isReady, data, analyticsAllowed, advertisingAllowed } = useCookieConsent();

  useEffect(() => {
    setDefaultGtmConsent();
    injectGtmScript();
  }, []);

  useEffect(() => {
    if (!isReady || !data) return;
    updateGtmConsent(data);
    syncClarityConsent(analyticsAllowed, advertisingAllowed);
  }, [advertisingAllowed, analyticsAllowed, data, isReady]);

  useEffect(() => {
    syncMixpanelConsent(isReady, analyticsAllowed);
  }, [analyticsAllowed, isReady]);

  return children;
}
