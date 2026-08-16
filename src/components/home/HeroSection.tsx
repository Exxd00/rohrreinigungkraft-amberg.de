"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  CheckCircle,
  Star,
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";
import { company } from "@/data/company";
import CallConfirmModal from "@/components/layout/CallConfirmModal";
import { useAvailableTechnicians } from "@/lib/useAvailableTechnicians";

export default function HeroSection() {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const availableTechnicians = useAvailableTechnicians();

  return (
    <>
      <CallConfirmModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        source="hero"
      />

      {/* HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden soft-blue-section">
        {/* Background */}
        <div className="absolute -top-32 -right-28 h-80 w-80 rounded-full bg-sky-200/40 dark:bg-transparent blur-3xl" />
        <div className="absolute top-40 -left-24 h-64 w-64 rounded-full bg-cyan-100/60 dark:bg-transparent blur-3xl" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230c83c7' fill-opacity='0.45'%3E%3Ccircle cx='4' cy='4' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Emergency accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-200 via-primary to-sky-200" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Availability Badge */}
            <div className="flex justify-center mb-4">
              <div className="liquid-glass inline-flex items-center gap-2 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {availableTechnicians} Techniker jetzt verfügbar
                </span>
              </div>
            </div>

            {/* MAIN HEADLINE - Differentiating */}
            <div className="text-center mb-6">
              {/* Location Badge - Prominent Amberg */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-sky-50/90 dark:bg-white/5 border border-sky-200 dark:border-sky-400/20 rounded-full shadow-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-100">
                  Rohrreinigung <span className="text-primary">Amberg</span> &
                  Oberpfalz
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="text-slate-900 dark:text-white">
                  Festpreis{" "}
                </span>
                <span className="text-gradient">VOR</span>
                <span className="text-slate-900 dark:text-white">
                  {" "}
                  dem ersten Handgriff.
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-200 font-semibold mb-2">
                Ihr Rohrreiniger für Amberg – Klarheit, bevor Sie zahlen.
              </p>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Wir kommen, schauen, erklären und nennen den Preis. Dann
                entscheiden{" "}
                <strong className="text-slate-900 dark:text-white">SIE</strong>.
                Kein Druck. Keine Überraschungen.
              </p>
            </div>

            {/* TRUST GUARANTEES BAR */}
            <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-6 mb-7">
              <div className="liquid-glass flex flex-col md:flex-row items-center gap-1.5 md:gap-2 rounded-2xl px-2 py-3 text-slate-700 dark:text-slate-200">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span className="text-xs md:text-sm font-medium">
                  Diagnose kostenlos
                </span>
              </div>
              <div className="liquid-glass flex flex-col md:flex-row items-center gap-1.5 md:gap-2 rounded-2xl px-2 py-3 text-slate-700 dark:text-slate-200">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="text-xs md:text-sm font-medium">
                  Festpreis vor Arbeit
                </span>
              </div>
              <div className="liquid-glass flex flex-col md:flex-row items-center gap-1.5 md:gap-2 rounded-2xl px-2 py-3 text-slate-700 dark:text-slate-200">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span className="text-xs md:text-sm font-medium">
                  Kein Start ohne OK
                </span>
              </div>
            </div>

            {/* MAIN CTA */}
            <div className="max-w-md mx-auto mb-8">
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="liquid-button w-full rounded-2xl px-5 py-4 md:py-5 flex items-center justify-center gap-4 active:scale-[0.98] transition-all group"
              >
                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 bg-white/25 border border-white/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="relative z-10 text-left">
                  <p className="text-white/80 text-sm font-medium">
                    Jetzt kostenlos anrufen
                  </p>
                  <p className="text-white text-2xl md:text-3xl font-black tracking-tight">
                    {company.contact.phoneDisplay}
                  </p>
                </div>
              </button>

              {/* Secondary CTA */}
              <Link href="/kontakt" className="block mt-3">
                <div className="liquid-glass w-full h-12 text-sky-800 dark:text-sky-200 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:border-sky-400 transition-colors">
                  <Zap className="w-4 h-4 text-primary" />
                  Rückruf in 5 Minuten anfordern
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* TRUST INDICATORS */}
            <div className="liquid-glass grid gap-3 rounded-2xl p-4 md:flex md:flex-wrap md:items-center md:justify-center md:gap-8 md:bg-transparent md:border-0 md:shadow-none md:backdrop-blur-none mb-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-slate-800 dark:text-white font-semibold text-sm md:text-base">
                  {company.rating.displayText}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                  ({company.rating.reviewCount} Bewertungen)
                </span>
              </div>
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  Amberg • Kümmersbruck • Sulzbach-Rosenberg • Umgebung
                </span>
              </div>
              <div className="flex items-center gap-2 border-t border-sky-100 dark:border-white/10 pt-3 md:border-0 md:pt-0">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-slate-600 dark:text-slate-300 text-sm">
                  In {company.urgency.responseTime} Min vor Ort
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 30L60 28C120 26 240 22 360 22C480 22 600 26 720 30C840 34 960 38 1080 36C1200 34 1320 26 1380 22L1440 18V60H0V30Z"
              fill="white"
              className="dark:fill-[#050607]"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
