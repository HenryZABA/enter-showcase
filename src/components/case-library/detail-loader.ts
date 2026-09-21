let pending: Promise<typeof import("./case-detail-dialog")> | undefined;

export function loadCaseDetail() {
  return pending ??= import("./case-detail-dialog").catch((error: unknown) => {
    pending = undefined;
    throw error;
  });
}

/** Fetch code on intent, never create an iframe or preload its remote site. */
export function preloadCaseDetail() {
  void loadCaseDetail().catch(() => { /* Opening can retry a failed intent preload. */ });
}
