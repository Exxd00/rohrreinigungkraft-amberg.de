import assert from "node:assert/strict";
import test from "node:test";
import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_SETTINGS_EVENT,
  clearAnalyticsAttributionData,
  clearPendingAnalyticsEvents,
  hasAnalyticsConsent,
  persistAnalyticsConsent,
  requestAnalyticsSettings,
} from "./analytics-consent.ts";
import {
  isAnalyticsConsentCookieAccepted,
  stripAnalyticsAttribution,
} from "./analytics-consent-policy.ts";
import {
  clearTrackingData,
  getTrackingData,
  initGclidTracking,
} from "./gclid.ts";
import { trackDirectCallClick, trackThankYouPage } from "./tracking.ts";
import {
  getThankYouTrackedKey,
  THANK_YOU_EVENT_ID_KEY,
  trackPendingThankYouEvent,
} from "./thank-you-tracking.ts";

const EVENT_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

interface BrowserHarness {
  storage: MemoryStorage;
  sessionStorage: MemoryStorage;
  gtagCalls: unknown[][];
  fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }>;
}

const installBrowser = (
  consent?: "accepted" | "rejected",
  options: { withGtag?: boolean } = {},
): BrowserHarness => {
  const storage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  if (consent) storage.setItem(ANALYTICS_CONSENT_KEY, consent);

  const gtagCalls: unknown[][] = [];
  const fetchCalls: BrowserHarness["fetchCalls"] = [];
  const eventTarget = new EventTarget();
  const mockWindow = Object.assign(eventTarget, {
    localStorage: storage,
    sessionStorage,
    location: {
      search:
        "?gclid=test-gclid&utm_source=google&utm_medium=cpc&utm_campaign=amberg",
      pathname: "/leistungen",
      href: "https://example.test/leistungen?gclid=test-gclid&utm_source=google&utm_medium=cpc&utm_campaign=amberg",
      hostname: "example.test",
      protocol: "https:",
    },
    document: { referrer: "https://www.google.com/" },
    crypto: { randomUUID: () => EVENT_ID },
    gtag:
      options.withGtag === false
        ? undefined
        : (...args: unknown[]) => gtagCalls.push(args),
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push({ input, init });
      const requestBody = JSON.parse(String(init?.body)) as { eventId: string };
      return Response.json({
        success: true,
        recorded: true,
        deduplicated: false,
        sheet: "📞 Alle Anfragen",
        row: 3,
        eventId: requestBody.eventId,
      });
    },
  }) as unknown as Window & typeof globalThis;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: mockWindow,
    writable: true,
  });

  return { storage, sessionStorage, gtagCalls, fetchCalls };
};

test.afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

test("does not store GCLID or UTM values before explicit analytics consent", () => {
  const { storage } = installBrowser();

  initGclidTracking();

  assert.equal(hasAnalyticsConsent(), false);
  assert.equal(storage.getItem("rk_gclid"), null);
  assert.equal(storage.getItem("rk_gclid_ts"), null);
  assert.equal(storage.getItem("rk_session"), null);
  assert.deepEqual(getTrackingData(), {
    gclid: null,
    gbraid: null,
    wbraid: null,
    source: "direct",
    medium: "none",
    campaign: "",
    landingPage: "",
    currentPage: "",
    referrer: "",
  });
});

test("does not store GCLID or UTM values after explicit rejection", () => {
  const { storage } = installBrowser("rejected");
  storage.setItem("rk_gclid", "stale-gclid");
  storage.setItem("rk_gclid_ts", String(Date.now()));
  storage.setItem("rk_session", '{"utmSource":"stale"}');

  clearAnalyticsAttributionData();
  initGclidTracking();

  assert.equal(storage.getItem("rk_gclid"), null);
  assert.equal(storage.getItem("rk_gclid_ts"), null);
  assert.equal(storage.getItem("rk_session"), null);
  assert.equal(getTrackingData().gclid, null);
});

test("stores attribution only after an accepted consent choice", () => {
  const { storage } = installBrowser();

  assert.equal(persistAnalyticsConsent("accepted"), true);
  initGclidTracking();

  const tracking = getTrackingData();
  assert.equal(hasAnalyticsConsent(), true);
  assert.equal(storage.getItem("rk_gclid"), "test-gclid");
  assert.notEqual(storage.getItem("rk_session"), null);
  assert.equal(tracking.gclid, "test-gclid");
  assert.equal(tracking.source, "google");
  assert.equal(tracking.medium, "cpc");
  assert.equal(tracking.campaign, "amberg");
});

test("removes all optional attribution data when consent is rejected", () => {
  const { storage } = installBrowser("accepted");
  initGclidTracking();

  clearTrackingData();
  assert.equal(persistAnalyticsConsent("rejected"), true);

  assert.equal(storage.getItem("rk_gclid"), null);
  assert.equal(storage.getItem("rk_gclid_ts"), null);
  assert.equal(storage.getItem("rk_session"), null);
  assert.equal(hasAnalyticsConsent(), false);
});

test("clears a pending thank-you event after explicit rejection", () => {
  const { sessionStorage } = installBrowser("accepted");
  sessionStorage.setItem(THANK_YOU_EVENT_ID_KEY, EVENT_ID);

  assert.equal(persistAnalyticsConsent("rejected"), true);
  clearPendingAnalyticsEvents();

  assert.equal(sessionStorage.getItem(THANK_YOU_EVENT_ID_KEY), null);
});

test("recognizes only an accepted server-visible consent cookie", () => {
  assert.equal(isAnalyticsConsentCookieAccepted("accepted"), true);
  assert.equal(isAnalyticsConsentCookieAccepted("rejected"), false);
  assert.equal(isAnalyticsConsentCookieAccepted(undefined), false);
});

test("strips optional attribution without removing contact lead fields", () => {
  const sanitized = stripAnalyticsAttribution({
    name: "Test lead",
    phone: "TEST-NO-CALL",
    gclid: "test-gclid",
    gbraid: "test-gbraid",
    wbraid: "test-wbraid",
    source: "google",
    medium: "cpc",
    campaign: "amberg",
    landingPage: "https://example.test/?gclid=test-gclid",
    currentPage: "https://example.test/kontakt",
    referrer: "https://google.example/",
  });

  assert.equal(sanitized.name, "Test lead");
  assert.equal(sanitized.phone, "TEST-NO-CALL");
  assert.equal(sanitized.gclid, null);
  assert.equal(sanitized.gbraid, null);
  assert.equal(sanitized.wbraid, null);
  assert.equal(sanitized.source, undefined);
  assert.equal(sanitized.medium, undefined);
  assert.equal(sanitized.campaign, undefined);
  assert.equal(sanitized.landingPage, undefined);
  assert.equal(sanitized.currentPage, undefined);
  assert.equal(sanitized.referrer, undefined);
});

test("exposes a settings event for reopening the consent banner", () => {
  installBrowser("accepted");
  let settingsRequests = 0;
  window.addEventListener(ANALYTICS_SETTINGS_EVENT, () => settingsRequests++);

  requestAnalyticsSettings();

  assert.equal(settingsRequests, 1);
});

test("does not send GA4 or Sheets click events without analytics consent", () => {
  const { gtagCalls, fetchCalls } = installBrowser("rejected");

  assert.equal(trackDirectCallClick("hero"), undefined);
  assert.equal(trackThankYouPage(EVENT_ID), false);
  assert.equal(gtagCalls.length, 0);
  assert.equal(fetchCalls.length, 0);
});

test("keeps a thank-you event pending while the gtag queue is not ready", () => {
  const { storage, gtagCalls } = installBrowser("accepted", {
    withGtag: false,
  });
  storage.setItem(THANK_YOU_EVENT_ID_KEY, EVENT_ID);

  assert.equal(trackThankYouPage(EVENT_ID), false);
  assert.equal(
    trackPendingThankYouEvent(storage, (eventId) => trackThankYouPage(eventId)),
    false,
  );
  assert.equal(storage.getItem(THANK_YOU_EVENT_ID_KEY), EVENT_ID);
  assert.equal(storage.getItem(getThankYouTrackedKey(EVENT_ID)), null);
  assert.equal(gtagCalls.length, 0);
});

test("deduplicates thank-you conversions by event ID, not by browser session", () => {
  const { storage } = installBrowser("accepted");
  const secondEventId = "5c5814f1-4196-4ab0-95ae-9dd8af4d7d5b";
  const sentEventIds: string[] = [];
  const send = (eventId: string) => {
    sentEventIds.push(eventId);
    return true;
  };

  storage.setItem(THANK_YOU_EVENT_ID_KEY, EVENT_ID);
  assert.equal(trackPendingThankYouEvent(storage, send), true);
  storage.setItem(THANK_YOU_EVENT_ID_KEY, secondEventId);
  assert.equal(trackPendingThankYouEvent(storage, send), true);

  assert.deepEqual(sentEventIds, [EVENT_ID, secondEventId]);
  assert.equal(storage.getItem(getThankYouTrackedKey(EVENT_ID)), "true");
  assert.equal(storage.getItem(getThankYouTrackedKey(secondEventId)), "true");
  assert.equal(storage.getItem(THANK_YOU_EVENT_ID_KEY), null);
});

test("shares one event ID between consented GA4 and Sheets without Ads routing", async () => {
  const { gtagCalls, fetchCalls } = installBrowser("accepted");
  initGclidTracking();

  assert.equal(trackDirectCallClick("hero"), EVENT_ID);
  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0]?.[0], "event");
  assert.equal(gtagCalls[0]?.[1], "direct_call_click");

  const gaParams = gtagCalls[0]?.[2] as Record<string, unknown>;
  assert.equal(gaParams.event_id, EVENT_ID);
  assert.equal(gaParams.send_to, "G-4YZB1PX342");
  assert.equal(JSON.stringify(gaParams).includes("AW-"), false);

  assert.equal(fetchCalls.length, 1);
  const sheetsBody = JSON.parse(String(fetchCalls[0]?.init?.body)) as {
    analyticsConsent: boolean;
    eventId: string;
    eventType: string;
  };
  assert.equal(sheetsBody.analyticsConsent, true);
  assert.equal(sheetsBody.eventId, EVENT_ID);
  assert.equal(sheetsBody.eventType, "direct_call_click");

  await new Promise((resolve) => setTimeout(resolve, 0));
});

test("stops all later optional events after consent is withdrawn", async () => {
  const { gtagCalls, fetchCalls } = installBrowser("accepted");
  initGclidTracking();
  trackDirectCallClick("before-withdrawal");
  await new Promise((resolve) => setTimeout(resolve, 0));

  clearTrackingData();
  persistAnalyticsConsent("rejected");
  trackDirectCallClick("after-withdrawal");
  trackThankYouPage(EVENT_ID);

  assert.equal(gtagCalls.length, 1);
  assert.equal(fetchCalls.length, 1);
});
