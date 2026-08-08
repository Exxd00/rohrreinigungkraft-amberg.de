"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  PhoneCall,
  PhoneIncoming,
} from "lucide-react";
import { company } from "@/data/company";
import { trackCallIntent, trackCallConfirmed, trackFormConfirmed } from "@/lib/tracking";
import { getTrackingData, getGclid } from "@/lib/gclid";

interface CallConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

type Step = "intent" | "confirm" | "callback" | "callback-success";

export default function CallConfirmModal({
  isOpen,
  onClose,
  source,
}: CallConfirmModalProps) {
  const [step, setStep] = useState<Step>("intent");
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callbackNumber, setCallbackNumber] = useState("");
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      trackCallIntent(source);
      setStep("intent");
      setIsCallInProgress(false);
      setCallbackNumber("");
      setCallbackError(null);
    }
  }, [isOpen, source]);

  const handleConfirmIntent = () => {
    setStep("confirm");
  };

  const handleCall = () => {
    // Prevent double clicks
    if (isCallInProgress) return;
    setIsCallInProgress(true);

    // Get tracking data for Google Sheets
    const trackingData = getTrackingData();
    const gclid = getGclid();

    // 🎯 CONVERSION: Track call confirmed
    trackCallConfirmed(source);

    // Send to Google Sheets in background (fire and forget)
    const payload = JSON.stringify({
      eventType: "call_confirmed",
      source: source,
      gclid: gclid,
      utmSource: trackingData.source,
      utmMedium: trackingData.medium,
      utmCampaign: trackingData.campaign,
      landingPage: trackingData.landingPage,
      currentPage: trackingData.currentPage,
      referrer: trackingData.referrer,
      timestamp: new Date().toISOString(),
    });

    // Use sendBeacon for reliable background sending
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/call-event", payload);
    } else {
      fetch("/api/call-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }

    // IMMEDIATELY make the call - no waiting!
    window.location.href = `tel:${company.contact.phone}`;

    // Close modal after short delay
    setTimeout(() => {
      onClose();
      setIsCallInProgress(false);
    }, 100);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingCallback) return;

    const trimmedNumber = callbackNumber.trim();
    if (trimmedNumber.length < 5) {
      setCallbackError("Bitte geben Sie eine gültige Telefonnummer ein.");
      return;
    }

    setCallbackError(null);
    setIsSubmittingCallback(true);

    const trackingData = getTrackingData();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Rückruf-Anfrage",
          phone: trimmedNumber,
          email: "",
          city: "Nicht angegeben",
          service: "Rückruf angefordert",
          message: `Kunde hat nicht erreicht (${source}) und bittet um Rückruf unter ${trimmedNumber}.`,
          gclid: trackingData.gclid,
          source: trackingData.source,
          medium: trackingData.medium,
          campaign: trackingData.campaign,
          landingPage: trackingData.landingPage,
          currentPage: trackingData.currentPage,
          referrer: trackingData.referrer,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      trackFormConfirmed({ service: "Rückruf angefordert" });
      setStep("callback-success");
    } catch (error) {
      console.error("Callback request failed:", error);
      setCallbackError(
        `Das hat leider nicht geklappt. Bitte rufen Sie uns direkt an: ${company.contact.phoneDisplay}`,
      );
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  const handleClose = () => {
    if (isCallInProgress || isSubmittingCallback) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal - Fixed size for mobile */}
      <div className="relative w-full max-w-[340px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isCallInProgress || isSubmittingCallback}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 disabled:opacity-50"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "intent" && (
          /* Step 1: Intent — choose direct call or callback request */
          <div className="p-5 text-center">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-7 h-7 text-primary" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Möchten Sie uns anrufen?
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Unser Team ist jetzt erreichbar
            </p>

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

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleConfirmIntent}
                className="w-full py-3.5 px-5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                Direkt anrufen
              </button>

              <button
                onClick={() => setStep("callback")}
                className="w-full py-3.5 px-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <PhoneIncoming className="w-5 h-5" />
                Rückruf anfordern
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Falls wir gerade nicht rangehen, rufen wir Sie zurück
              </p>
            </div>
          </div>
        )}

        {step === "confirm" && (
          /* Step 2: Confirm direct call */
          <div className="p-5 text-center">
            {/* Header gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

            {/* Phone Number */}
            <div className="mb-4 pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Sie werden verbunden mit:
              </p>
              <div className="text-2xl font-bold text-primary dark:text-primary">
                {company.contact.phoneDisplay}
              </div>
            </div>

            {/* Benefits - Compact */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Kostenlose Beratung
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Meist 20-40 Min vor Ort
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  24/7 Notdienst
                </span>
              </div>
            </div>

            {/* Call Button - With loading state */}
            <button
              onClick={handleCall}
              disabled={isCallInProgress}
              className="w-full py-4 px-5 gradient-primary text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCallInProgress ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verbinde...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Jetzt anrufen
                </>
              )}
            </button>

            {/* Back link */}
            <button
              onClick={() => setStep("intent")}
              disabled={isCallInProgress}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
            >
              ← Zurück
            </button>
          </div>
        )}

        {step === "callback" && (
          /* Step 3: Callback request — leave a number to be called back */
          <form onSubmit={handleCallbackSubmit} className="p-5 text-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />

            <div className="w-14 h-14 mx-auto mb-3 mt-2 rounded-full bg-primary/10 flex items-center justify-center">
              <PhoneIncoming className="w-7 h-7 text-primary" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Rückruf anfordern
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tragen Sie Ihre Nummer ein — falls wir nicht sofort rangehen,
              rufen wir Sie zurück.
            </p>

            <label htmlFor="callback-phone" className="sr-only">
              Ihre Telefonnummer
            </label>
            <input
              id="callback-phone"
              type="tel"
              inputMode="tel"
              autoFocus
              placeholder="Ihre Telefonnummer"
              value={callbackNumber}
              onChange={(e) => {
                setCallbackNumber(e.target.value);
                if (callbackError) setCallbackError(null);
              }}
              className="w-full px-4 py-3.5 text-center text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal placeholder:text-base focus:outline-none focus:border-primary transition-colors mb-3"
            />

            {callbackError && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                {callbackError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingCallback}
              className="w-full py-3.5 px-5 gradient-primary text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmittingCallback ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <PhoneIncoming className="w-5 h-5" />
                  Rückruf anfordern
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("intent")}
              disabled={isSubmittingCallback}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
            >
              ← Zurück
            </button>
          </form>
        )}

        {step === "callback-success" && (
          /* Step 4: Confirmation */
          <div className="p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Alles klar!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Wir rufen Sie unter{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {callbackNumber}
              </span>{" "}
              schnellstmöglich zurück.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 px-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
            >
              Schließen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
