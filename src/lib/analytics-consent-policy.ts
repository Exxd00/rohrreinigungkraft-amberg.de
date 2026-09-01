export const ANALYTICS_CONSENT_COOKIE = "rk_amberg_analytics_consent";

export const isAnalyticsConsentCookieAccepted = (
  value: string | null | undefined,
): boolean => value === "accepted";

export interface AnalyticsAttributionFields {
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  source?: string;
  medium?: string;
  campaign?: string;
  landingPage?: string;
  currentPage?: string;
  referrer?: string;
}

/** Keep a requested contact/callback lead, but remove optional attribution. */
export function stripAnalyticsAttribution<T extends AnalyticsAttributionFields>(
  value: T,
): T {
  return {
    ...value,
    gclid: null,
    gbraid: null,
    wbraid: null,
    source: undefined,
    medium: undefined,
    campaign: undefined,
    landingPage: undefined,
    currentPage: undefined,
    referrer: undefined,
  };
}
