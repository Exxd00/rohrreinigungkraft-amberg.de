"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_READY_EVENT,
  type AnalyticsConsentChoice,
  clearAnalyticsAttributionData,
  hasAnalyticsConsent,
  syncAnalyticsConsentState,
} from "@/lib/analytics-consent";
import { initGclidTracking } from "@/lib/gclid";
import { ensureGoogleTagQueue } from "@/lib/google-tag";
import { trackCallConfirmed, trackDirectCallClick } from "@/lib/tracking";

const GA_MEASUREMENT_ID = "G-4YZB1PX342";

/**
 * TrackingInit Component
 * Initializes GCLID and UTM parameter tracking on page load
 * This captures Google Ads click IDs and campaign parameters
 */
export default function TrackingInit() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const consentChoice = syncAnalyticsConsentState();
    if (consentChoice !== "accepted") clearAnalyticsAttributionData();

    const enableAnalytics = () => {
      if (!hasAnalyticsConsent()) return;

      const gtag = ensureGoogleTagQueue(window);
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);

      initGclidTracking();
      setAnalyticsEnabled(true);
      window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
    };

    const handleConsent = (event: Event) => {
      const choice = (event as CustomEvent<AnalyticsConsentChoice>).detail;
      if (choice === "accepted") {
        enableAnalytics();
      } else {
        clearAnalyticsAttributionData();
        setAnalyticsEnabled(false);
      }
    };

    enableAnalytics();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);

    const handleTelephoneClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const telephoneLink =
        target?.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!telephoneLink) return;

      const source =
        telephoneLink.dataset.trackingSource || window.location.pathname;

      if (telephoneLink.dataset.trackingEvent === "direct_call_click") {
        trackDirectCallClick(source);
        return;
      }

      trackCallConfirmed(source);
    };

    document.addEventListener("click", handleTelephoneClick);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Tracking] GCLID and UTM tracking initialized");
    }
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
      document.removeEventListener("click", handleTelephoneClick);
    };
  }, []);

  if (!analyticsEnabled) return null;

  return (
    <Script
      id="google-tag"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
