import type { Attribution } from "@/lib/schemas";

const KEY = "ksc.attribution.v1";

function first(params: URLSearchParams, name: string): string {
  return params.get(name)?.trim() ?? "";
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
      landingPath: existing.landingPath || `${window.location.pathname}${window.location.search}`,
      referrer: existing.referrer || document.referrer || "",
    };
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      return {
        landingPath: `${window.location.pathname}${window.location.search}`,
        referrer: document.referrer || "",
      };
    }
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}
