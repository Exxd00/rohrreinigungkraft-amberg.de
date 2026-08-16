import { getGclid, getTrackingData } from "./gclid";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type ConversionEvent = "kraft_call" | "kraft_callback" | "kraft_thank_you";

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

export const trackCallConfirmed = (source: string) => {
  trackConversion("kraft_call", {
    event_label: source,
    lead_type: "phone_call",
    contact_method: "phone",
    value: 25,
    has_gclid: !!getGclid(),
  });
};

export const trackCallbackSuccess = (source: string) => {
  trackConversion("kraft_callback", {
    event_label: source,
    lead_type: "callback_request",
    contact_method: "callback",
    value: 50,
    has_gclid: !!getGclid(),
  });
};

export const trackThankYouPage = () => {
  const tracking = getTrackingData();
  trackConversion("kraft_thank_you", {
    event_label: "contact_form_success",
    lead_type: "contact_form",
    contact_method: "form",
    value: 50,
    landing_page: tracking.landingPage,
  });
};

// Existing UI imports remain compatible, but only the three lead events above
// are sent to GA4.
export const trackPhoneClick = trackCallConfirmed;
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
