"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Phone, X } from "lucide-react";
import { company } from "@/data/company";
import {
  trackCallConfirmed,
  trackCallIntent,
  trackFormConfirmed,
} from "@/lib/tracking";
import { getGclid, getTrackingData } from "@/lib/gclid";

interface CallConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}

export default function CallConfirmModal({
  isOpen,
  onClose,
  source,
}: CallConfirmModalProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    trackCallIntent(source);
    setPhone("");
    setName("");
    setError("");
    setIsSubmitted(false);
    setIsSubmitting(false);
    const timer = window.setTimeout(() => phoneInputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [isOpen, source]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  const logConfirmedCall = () => {
    const tracking = getTrackingData();
    const payload = JSON.stringify({
      eventType: "call_confirmed",
      source,
      gclid: getGclid(),
      utmSource: tracking.source,
      utmMedium: tracking.medium,
      utmCampaign: tracking.campaign,
      landingPage: tracking.landingPage,
      currentPage: tracking.currentPage,
      referrer: tracking.referrer,
      timestamp: new Date().toISOString(),
    });

    trackCallConfirmed(source);
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
  };

  const handleCallbackRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      setError("Bitte geben Sie Ihre Telefonnummer ein.");
      phoneInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError("");
    const tracking = getTrackingData();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Rückruf gewünscht",
          phone: normalizedPhone,
          email: "",
          city: "Amberg / Rückruf",
          service: "Rückrufwunsch",
          message: `Rückruf über das Anruf-Fenster angefordert (${source}).`,
          images: [],
          gclid: tracking.gclid,
          source: tracking.source,
          medium: tracking.medium,
          campaign: tracking.campaign,
          landingPage: tracking.landingPage,
          currentPage: tracking.currentPage,
          referrer: tracking.referrer,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.details || result.error);

      trackFormConfirmed({ service: "Rückrufwunsch", city: "Amberg" });
      setIsSubmitted(true);
    } catch (submissionError) {
      console.error("Callback request failed:", submissionError);
      setError(
        `Der Rückruf konnte nicht gesendet werden. Bitte rufen Sie uns direkt unter ${company.contact.phoneDisplay} an.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Dialog schließen"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-dialog-title"
        className="liquid-glass relative w-full max-w-md overflow-hidden rounded-3xl p-6 dark:border-slate-700 dark:bg-slate-900 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Schließen"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="py-5 text-center" aria-live="polite">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Rückruf ist angefordert
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Vielen Dank. Wir melden uns so schnell wie möglich bei Ihnen.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Schließen
            </button>
          </div>
        ) : (
          <>
            <div className="pr-8">
              <h2
                id="callback-dialog-title"
                className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
              >
                Lieber einen Rückruf erhalten?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Hinterlassen Sie Ihre Nummer. Falls wir gerade im Einsatz sind,
                rufen wir Sie schnellstmöglich zurück.
              </p>
            </div>

            <form onSubmit={handleCallbackRequest} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="callback-phone"
                  className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Telefonnummer <span className="text-red-500">*</span>
                </label>
                <input
                  ref={phoneInputRef}
                  id="callback-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+49 …"
                  className="h-12 w-full rounded-xl border border-sky-200 bg-white/85 px-4 text-base text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="callback-name"
                  className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Name{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="callback-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ihr Name"
                  className="h-12 w-full rounded-xl border border-sky-200 bg-white/85 px-4 text-base text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {error && (
                <p
                  className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="liquid-button flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 font-bold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Wird gesendet…
                  </>
                ) : (
                  "Rückruf anfordern"
                )}
              </button>
            </form>

            <a
              href={`tel:${company.contact.phone}`}
              onClick={logConfirmedCall}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-5 font-bold text-primary transition-colors hover:bg-primary/5 dark:text-[#73A6DE]"
            >
              <Phone className="h-5 w-5" />
              Jetzt direkt anrufen
            </a>
            <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              Ihre Nummer wird nur für diesen Rückruf verwendet.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
