import { getGclid, getTrackingData } from "./gclid.ts";
import { hasAnalyticsConsent } from "./analytics-consent.ts";
import { getDirectCallInteractionLocation } from "./direct-call-source.ts";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type ConversionEvent =
  | "amberg_phone_click"
  | "kraft_callback"
  | "kraft_thank_you";

type TelephoneEvent = "amberg_phone_click" | "direct_call_click";

const trackConversion = (
  eventName: ConversionEvent,
  eventParams: Record<string, unknown>,
) => {
  if (
    typeof window === "undefined" ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  const tracking = getTrackingData();
  const params = {
    event_category: "lead",
    currency: "EUR",
    gclid: tracking.gclid || undefined,
    gbraid: tracking.gbraid || undefined,
    wbraid: tracking.wbraid || undefined,
    traffic_source: tracking.source,
    traffic_medium: tracking.medium,
    traffic_campaign: tracking.campaign || undefined,
    ...eventParams,
  };

  window.gtag?.("event", eventName, params);

  if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] ${eventName}`, params);
  }
  return true;
};

const postTelephoneClickToSheets = (
  eventType: TelephoneEvent,
  source: string,
  eventId: string,
) => {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  const tracking = getTrackingData();
  const body = JSON.stringify({
    eventType,
    eventId,
    analyticsConsent: true,
    source,
    gclid: tracking.gclid,
    gbraid: tracking.gbraid,
    wbraid: tracking.wbraid,
    utmSource: tracking.source,
    utmMedium: tracking.medium,
    utmCampaign: tracking.campaign,
    landingPage: tracking.landingPage,
    currentPage: tracking.currentPage,
    referrer: tracking.referrer,
  });

  void window
    .fetch("/api/call-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    })
    .then(async (response) => {
      const receipt = (await response.json().catch(() => null)) as {
        success?: boolean;
        sheet?: string;
        row?: number;
        eventId?: string;
        deduplicated?: boolean;
      } | null;

      if (
        !response.ok ||
        receipt?.success !== true ||
        receipt.sheet !== "📞 Alle Anfragen" ||
        typeof receipt.row !== "number" ||
        !Number.isSafeInteger(receipt.row) ||
        receipt.row < 3 ||
        receipt.eventId !== eventId ||
        typeof receipt.deduplicated !== "boolean"
      ) {
        console.error(`[Sheets] ${eventType} was not recorded`, {
          status: response.status,
          eventId,
        });
      }
    })
    .catch((error) => {
      console.error(`[Sheets] ${eventType} request failed`, error);
    });
};

// Basic engagement event for "Jetzt direkt anrufen". It is deliberately kept
// outside the conversion helper and routed to GA4 (not Ads) plus Sheets.
export const trackDirectCallClick = (source: string) => {
  if (
    typeof window === "undefined" ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  const eventId = window.crypto.randomUUID();
  const tracking = getTrackingData();

  window.gtag?.("event", "direct_call_click", {
    send_to: "G-4YZB1PX342",
    event_id: eventId,
    event_category: "engagement",
    event_label: source,
    interaction_type: "direct_call",
    interaction_location: getDirectCallInteractionLocation(source),
    contact_method: "phone",
    site: "amberg",
    gclid: tracking.gclid || undefined,
    gbraid: tracking.gbraid || undefined,
    wbraid: tracking.wbraid || undefined,
    traffic_source: tracking.source,
    traffic_medium: tracking.medium,
    traffic_campaign: tracking.campaign || undefined,
  });

  postTelephoneClickToSheets("direct_call_click", source, eventId);
  return eventId;
};

export const trackPhoneClick = (source: string) => {
  if (
    typeof window === "undefined" ||
    !hasAnalyticsConsent() ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  const eventId = window.crypto.randomUUID();
  trackConversion("amberg_phone_click", {
    event_id: eventId,
    event_label: source,
    lead_type: "phone_click",
    contact_method: "phone",
    has_gclid: !!getGclid(),
  });

  postTelephoneClickToSheets("amberg_phone_click", source, eventId);
  return eventId;
};

export const trackCallbackSuccess = (source: string, eventId?: string) => {
  return trackConversion("kraft_callback", {
    event_label: source,
    lead_type: "callback_request",
    contact_method: "callback",
    event_id: eventId,
    has_gclid: !!getGclid(),
  });
};

export const trackThankYouPage = (eventId?: string) => {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return false;

  const tracking = getTrackingData();
  return trackConversion("kraft_thank_you", {
    event_label: "contact_form_success",
    lead_type: "contact_form",
    contact_method: "form",
    event_id: eventId,
    landing_page: tracking.landingPage,
  });
};

// Existing UI imports remain compatible, but only the three lead events above
// are sent to GA4.
export const trackCallConfirmed = trackPhoneClick;
export const trackCallIntent = (_source: string) => {};
export const trackEmailIntent = (_source: string) => {};
export const trackEmailConfirmed = (_source: string) => {};
export const trackFormConfirmed = (_data?: Record<string, unknown>) => {};
export const trackGenerateLead = (_source: string, _location?: string) => {};
export const trackCityView = (_name: string, _slug: string) => {};
export const trackServiceView = (_name: string, _slug: string) => {};
export const trackWhatsAppClick = (_source: string) => {};
export const trackCTAClick = (_name: string, _location?: string) => {};
export const trackFormSubmit = trackFormConfirmed;
export const trackLead = (_data?: Record<string, unknown>) => {};

export const getCompleteTrackingData = () => getTrackingData();
