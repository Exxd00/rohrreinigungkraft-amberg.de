"use client";

import { useState, useEffect } from "react";
import { X, PhoneCall } from "lucide-react";
import { company } from "@/data/company";
import { trackCallIntent, trackCallConfirmed, trackFormConfirmed } from "@/lib/tracking";
import { getTrackingData, getGclid } from "@/lib/gclid";

interface CallConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

const PHONE_PREFIX = "+49 ";

export default function CallConfirmModal({
  isOpen,
  onClose,
  source,
}: CallConfirmModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackCallIntent(source);
      setName("");
      setPhone(PHONE_PREFIX);
      setIsCallInProgress(false);
    }
  }, [isOpen, source]);

  const handleClose = () => {
    if (isCallInProgress) return;
    onClose();
  };

  const handleDirectCall = () => {
    // Prevent double clicks
    if (isCallInProgress) return;
    setIsCallInProgress(true);

    const trackingData = getTrackingData();
    const gclid = getGclid();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const hasCallbackNumber = trimmedPhone.replace(/\D/g, "").length >= 6;

    // 🎯 CONVERSION: Track call confirmed
    trackCallConfirmed(source);

    // Send the call event to Google Sheets in the background (fire and forget)
    const callEventPayload = JSON.stringify({
      eventType: "call_confirmed",
      source,
      gclid,
      utmSource: trackingData.source,
      utmMedium: trackingData.medium,
      utmCampaign: trackingData.campaign,
      landingPage: trackingData.landingPage,
      currentPage: trackingData.currentPage,
      referrer: trackingData.referrer,
      timestamp: new Date().toISOString(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/call-event", callEventPayload);
    } else {
      fetch("/api/call-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: callEventPayload,
        keepalive: true,
      }).catch(() => {});
    }

    // If the visitor left a name/number, capture it as a callback safety net
    // in case the direct call goes unanswered — fire and forget, never blocks
    // the actual call below.
    if (hasCallbackNumber || trimmedName) {
      const contactPayload = JSON.stringify({
        name: trimmedName || "Nicht angegeben",
        phone: hasCallbackNumber ? trimmedPhone : "Nicht angegeben",
        email: "",
        city: "Nicht angegeben",
        service: "Rückruf-Absicherung (Direktanruf)",
        message: `Kunde hat direkt angerufen (${source}) und zusätzlich einen Rückruf-Kontakt hinterlassen, falls der Anruf verpasst wird.`,
        gclid,
        source: trackingData.source,
        medium: trackingData.medium,
        campaign: trackingData.campaign,
        landingPage: trackingData.landingPage,
        currentPage: trackingData.currentPage,
        referrer: trackingData.referrer,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/contact",
          new Blob([contactPayload], { type: "application/json" }),
        );
      } else {
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: contactPayload,
          keepalive: true,
        }).catch(() => {});
      }
      trackFormConfirmed({ service: "Rückruf-Absicherung" });
    }

    // IMMEDIATELY make the call - no waiting, no extra confirmation step!
    window.location.href = `tel:${company.contact.phone}`;

    // Close modal after short delay
    setTimeout(() => {
      onClose();
      setIsCallInProgress(false);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[340px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isCallInProgress}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 disabled:opacity-50"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 pt-6 text-center">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <PhoneCall className="w-7 h-7 text-primary" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Jetzt anrufen
          </h3>

          {/* Availability */}
          <div className="flex items-center justify-center gap-2 mb-4 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              24/7 erreichbar
            </span>
          </div>

          {/* Explanatory note */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Falls wir gerade beschäftigt sind: Tragen Sie Ihre Nummer ein –
            wir rufen Sie zurück.
          </p>

          {/* Phone */}
          <label htmlFor="direct-call-phone" className="sr-only">
            Ihre Telefonnummer
          </label>
          <input
            id="direct-call-phone"
            type="tel"
            inputMode="tel"
            placeholder="Ihre Telefonnummer"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 text-center text-base font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-primary transition-colors mb-2"
          />

          {/* Name */}
          <label htmlFor="direct-call-name" className="sr-only">
            Ihr Name
          </label>
          <input
            id="direct-call-name"
            type="text"
            placeholder="Ihr Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-center text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors mb-4"
          />

          {/* Call Button */}
          <button
            onClick={handleDirectCall}
            disabled={isCallInProgress}
            className="w-full py-4 px-5 gradient-primary text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <PhoneCall className="w-5 h-5" />
            Jetzt direkt anrufen
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Ruft sofort {company.contact.phoneDisplay} an
          </p>
        </div>
      </div>
    </div>
  );
}
