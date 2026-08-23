import { getGclid, getTrackingData } from "./gclid";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type ConversionEvent =
  | "amberg_phone_click"
  | "kraft_callback"
  | "kraft_thank_you";

const trackConversion = (
  eventName: ConversionEvent,
  eventParams: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;

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
};

export const trackPhoneClick = (source: string) => {
  trackConversion("amberg_phone_click", {
    event_label: source,
    lead_type: "phone_click",
    contact_method: "phone",
    has_gclid: !!getGclid(),
  });
};

export const trackCallbackSuccess = (source: string, eventId?: string) => {
  trackConversion("kraft_callback", {
    event_label: source,
    lead_type: "callback_request",
    contact_method: "callback",
    event_id: eventId,
    has_gclid: !!getGclid(),
  });
};

export const trackThankYouPage = (eventId?: string) => {
  const tracking = getTrackingData();
  trackConversion("kraft_thank_you", {
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
