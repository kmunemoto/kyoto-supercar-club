/**
 * Every lead route is measured the same way — start, submit, error, plus the
 * CTA click that led there — so the two paths into the funnel (the forms and
 * the official LINE account) can be compared against each other.
 */
export type TrackEvent =
  | "owner_cta_click"
  | "owner_form_start"
  | "owner_form_submit"
  | "owner_form_error"
  | "member_prereg_submit"
  | "collection_cta_click"
  | "collection_form_start"
  | "collection_prereg_submit"
  | "collection_form_error"
  | "contact_form_start"
  | "contact_form_submit"
  | "contact_form_error"
  | "line_cta_click";

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

export type ConsentState = "granted" | "denied" | "unset";

export function analyticsConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const value = window.localStorage.getItem(analyticsConsentKey());
    if (value === "granted" || value === "denied") return value;
    return "unset";
  } catch {
    return "unset";
  }
}

export function hasAnalyticsConsent(): boolean {
  return analyticsConsent() === "granted";
}

/**
 * A refusal is stored, not just forgotten. Clearing the key would bring the
 * banner back on the next page load, which reads as nagging.
 */
export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(analyticsConsentKey(), granted ? "granted" : "denied");
  } catch {
    /* ignore */
  }
}

/** Used by the footer link so a visitor can change their mind. */
export function clearAnalyticsConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(analyticsConsentKey());
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

/**
 * Neither tag sees a client-side route change on its own: the Meta Pixel does
 * not watch history at all, and GA4's enhanced measurement is a setting we do
 * not control from here. Without this, every conversion is attributed to the
 * first landing page.
 */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  try {
    const w = window as TrackerWindow;
    w.gtag?.("event", "page_view", { page_path: path });
    w.fbq?.("track", "PageView");
  } catch {
    /* ignore */
  }
}

export function analyticsIds() {
  return { gaId: gaId(), pixelId: pixelId() };
}
