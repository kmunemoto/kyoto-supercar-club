export type TrackEvent =
  | "owner_cta_click"
  | "owner_form_start"
  | "owner_form_submit"
  | "owner_form_error"
  | "member_prereg_submit"
  | "collection_cta_click"
  | "collection_prereg_submit";

function gaId(): string | undefined {
  const value = import.meta.env["VITE_GA_MEASUREMENT_ID"];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function pixelId(): string | undefined {
  const value = import.meta.env["VITE_META_PIXEL_ID"];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function hasAnalyticsConfig(): boolean {
  return Boolean(gaId() || pixelId());
}

export function analyticsConsentKey(): string {
  return "ksc.analytics-consent";
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(analyticsConsentKey()) === "granted";
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (granted) window.localStorage.setItem(analyticsConsentKey(), "granted");
    else window.localStorage.removeItem(analyticsConsentKey());
  } catch {
    /* ignore */
  }
}

type TrackerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function track(event: TrackEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  try {
    const w = window as TrackerWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event, ...params });
    w.gtag?.("event", event, params);
    w.fbq?.("trackCustom", event, params);
  } catch {
    /* ignore */
  }
}

export function analyticsIds() {
  return { gaId: gaId(), pixelId: pixelId() };
}
