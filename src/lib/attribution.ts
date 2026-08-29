import type { Attribution } from "@/lib/schemas";

const KEY = "ksc.attribution.v1";

/**
 * Attribution is captured from the URL and the referrer, never typed by the
 * visitor, so it must never be able to block a submission. Values are clamped
 * here to the same limits the schema enforces (see `attributionField`).
 */
const UTM_MAX = 200;
const URL_MAX = 500;

function clamp(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function first(params: URLSearchParams, name: string): string {
  return clamp(params.get(name) ?? "", UTM_MAX);
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const existing = readAttribution();
    const next: Attribution = {
      utmSource: first(params, "utm_source") || existing.utmSource || "",
      utmMedium: first(params, "utm_medium") || existing.utmMedium || "",
      utmCampaign: first(params, "utm_campaign") || existing.utmCampaign || "",
      utmContent: first(params, "utm_content") || existing.utmContent || "",
      utmTerm: first(params, "utm_term") || existing.utmTerm || "",
      landingPath: existing.landingPath || currentPath(),
      referrer: existing.referrer || currentReferrer(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function currentPath(): string {
  return clamp(`${window.location.pathname}${window.location.search}`, URL_MAX);
}

function currentReferrer(): string {
  return clamp(document.referrer || "", URL_MAX);
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      return { landingPath: currentPath(), referrer: currentReferrer() };
    }
    const stored = JSON.parse(raw) as Attribution;
    // Values written by an older build may exceed the limits.
    return {
      utmSource: clamp(stored.utmSource ?? "", UTM_MAX),
      utmMedium: clamp(stored.utmMedium ?? "", UTM_MAX),
      utmCampaign: clamp(stored.utmCampaign ?? "", UTM_MAX),
      utmContent: clamp(stored.utmContent ?? "", UTM_MAX),
      utmTerm: clamp(stored.utmTerm ?? "", UTM_MAX),
      landingPath: clamp(stored.landingPath ?? "", URL_MAX),
      referrer: clamp(stored.referrer ?? "", URL_MAX),
    };
  } catch {
    return {};
  }
}
