import { ANALYTICS_CONSENT_COOKIE } from "./analytics-consent-policy.ts";

export const ANALYTICS_CONSENT_KEY = "rk_amberg_consent";
export const ANALYTICS_CONSENT_EVENT = "rk:analytics-consent";
export const ANALYTICS_SETTINGS_EVENT = "rk:analytics-settings";
export const ANALYTICS_READY_EVENT = "rk:analytics-ready";

export type AnalyticsConsentChoice = "accepted" | "rejected";

const ATTRIBUTION_STORAGE_KEYS = ["rk_gclid", "rk_gclid_ts", "rk_session"];
const PENDING_THANK_YOU_EVENT_KEY = "kraft_form_event_id";
const CONSENT_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const GOOGLE_ANALYTICS_COOKIE_PATTERN =
  /^_(?:ga(?:_|$)|gid(?:_|$)|gat(?:_|$)|gcl_|gac_)/;

const readCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = window.document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  } catch {
    return null;
  }
};

const writeConsentCookie = (choice: AnalyticsConsentChoice): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    window.document.cookie = `${encodeURIComponent(ANALYTICS_CONSENT_COOKIE)}=${encodeURIComponent(choice)}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
    return true;
  } catch {
    return false;
  }
};

const expireCookie = (name: string): void => {
  if (typeof window === "undefined") return;

  const encodedName = encodeURIComponent(name);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const expired = `${encodedName}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
  window.document.cookie = expired;

  const hostname = window.location.hostname;
  if (
    !hostname ||
    hostname === "localhost" ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
  ) {
    return;
  }

  window.document.cookie = `${expired}; Domain=${hostname}`;
  const registrableHost = hostname.replace(/^www\./, "");
  window.document.cookie = `${expired}; Domain=.${registrableHost}`;
};

const clearGoogleAnalyticsCookies = (): void => {
  if (typeof window === "undefined") return;

  try {
    const cookieNames = window.document.cookie
      .split(";")
      .map((part) => part.trim().split("=")[0] || "")
      .map((name) => decodeURIComponent(name))
      .filter((name) => GOOGLE_ANALYTICS_COOKIE_PATTERN.test(name));

    for (const name of new Set(cookieNames)) expireCookie(name);
  } catch {
    // Ignore unavailable cookie storage.
  }
};

export function clearPendingAnalyticsEvents(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(PENDING_THANK_YOU_EVENT_KEY);
  } catch {
    // Ignore unavailable session storage.
  }
}

export function clearAnalyticsAttributionData(): void {
  if (typeof window === "undefined") return;

  try {
    for (const key of ATTRIBUTION_STORAGE_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore unavailable browser storage.
  }

  clearGoogleAnalyticsCookies();
}

export function getAnalyticsConsentChoice(): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  let localChoice: string | null = null;
  try {
    localChoice = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    // Fall back to the first-party consent cookie.
  }

  const cookieChoice = readCookie(ANALYTICS_CONSENT_COOKIE);
  if (localChoice === "rejected" || cookieChoice === "rejected") {
    return "rejected";
  }
  if (localChoice === "accepted" || cookieChoice === "accepted") {
    return "accepted";
  }
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsentChoice() === "accepted";
}

/** Synchronize legacy local-only choices into the first-party cookie. */
export function syncAnalyticsConsentState(): AnalyticsConsentChoice | null {
  const choice = getAnalyticsConsentChoice();
  if (!choice || typeof window === "undefined") return choice;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
  } catch {
    // Cookie remains the server-visible source of truth.
  }
  writeConsentCookie(choice);

  if (choice === "rejected") {
    clearAnalyticsAttributionData();
    clearPendingAnalyticsEvents();
  }
  return choice;
}

export function persistAnalyticsConsent(
  choice: AnalyticsConsentChoice,
): boolean {
  if (typeof window === "undefined") return false;

  if (choice === "rejected") {
    clearAnalyticsAttributionData();
    clearPendingAnalyticsEvents();
  }

  let localStorageSaved = false;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    localStorageSaved = true;
  } catch {
    // The first-party cookie can still persist the choice.
  }

  const cookieSaved = writeConsentCookie(choice);
  if (!localStorageSaved && !cookieSaved) return false;

  window.dispatchEvent(
    new CustomEvent<AnalyticsConsentChoice>(ANALYTICS_CONSENT_EVENT, {
      detail: choice,
    }),
  );
  return true;
}

export function requestAnalyticsSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT));
}
