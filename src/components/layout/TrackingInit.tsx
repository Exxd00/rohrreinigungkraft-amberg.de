"use client";

import { useEffect } from "react";
import { initGclidTracking } from "@/lib/gclid";
import {
  trackCallConfirmed,
  trackDirectCallClick,
} from "@/lib/tracking";

/**
 * TrackingInit Component
 * Initializes GCLID and UTM parameter tracking on page load
 * This captures Google Ads click IDs and campaign parameters
 */
export default function TrackingInit() {
  useEffect(() => {
    // Initialize GCLID and UTM tracking
    // This captures gclid from URL and stores session data for conversion tracking
    initGclidTracking();

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
    return () => document.removeEventListener("click", handleTelephoneClick);
  }, []);

  // This component doesn't render anything
  return null;
}
