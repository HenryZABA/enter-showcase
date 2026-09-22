import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "153bf97831e550c490f1f51fac241dea";
let initialized = false;
let previouslyAllowed = false;

function enableMixpanel(): void {
  if (!initialized) {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
    });
    initialized = true;
    if (!mixpanel.has_opted_out_tracking()) return;
  }

  mixpanel.opt_in_tracking();
  if (mixpanel.has_opted_out_tracking()) return;
  mixpanel.start_session_recording();
  mixpanel.track_pageview();
}

export function syncMixpanelConsent(isReady: boolean, analyticsAllowed: boolean): void {
  if (!isReady) return;
  if (!analyticsAllowed) {
    if (initialized) {
      mixpanel.stop_session_recording();
      const optOutOptions = { delete_user: false, clear_persistence: false };
      mixpanel.opt_out_tracking(optOutOptions);
    }
    previouslyAllowed = false;
    return;
  }

  if (!initialized || !previouslyAllowed) enableMixpanel();
  previouslyAllowed = true;
}
