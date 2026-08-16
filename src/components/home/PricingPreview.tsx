"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { company } from "@/data/company";
import CallConfirmModal from "@/components/layout/CallConfirmModal";

const pricingItems = [
  {
    service: "Toilette verstopft",
    price: company.pricing.services.toiletteVerstopft.from,
    popular: true,
  },
  {
    service: "Rohrreinigung",
    price: company.pricing.services.rohrreinigung.from,
    popular: false,
  },
  {
    service: "Abfluss verstopft",
    price: company.pricing.services.abflussreinigung.from,
    popular: false,
  },
  {
    service: "Kanalreinigung",
    price: company.pricing.services.kanalreinigung.from,
    popular: false,
  },
];

export default function PricingPreview() {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  return (
    <>
      <CallConfirmModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        source="pricing_preview"
      />

      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="mobile-section-title text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Transparente Festpreise
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Keine versteckten Kosten • Preis vor Arbeitsbeginn
              </p>
            </div>

            {/* Price Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              {pricingItems.map((item) => (
                <button
                  key={item.service}
                  onClick={() => setIsCallModalOpen(true)}
                  className={`liquid-glass relative min-h-[128px] p-4 md:p-5 rounded-2xl transition-all hover:scale-[1.02] text-left ${
                    item.popular
                      ? "!border-primary bg-primary/5 dark:bg-primary/10"
                      : "hover:!border-primary/50"
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Häufig
                    </span>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {item.service}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    ab {item.price}€
                  </p>
                </button>
              ))}
            </div>

            {/* Trust Points + CTA */}
            <div className="liquid-glass rounded-2xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Diagnose kostenlos
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Festpreis vorab
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Kein Start ohne OK
                  </div>
                </div>
                <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="liquid-button px-4 md:px-5 py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Jetzt anrufen
                  </button>
                  <Link
                    href="/preise"
                    className="px-4 md:px-5 py-3 border border-sky-200 bg-white/70 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all"
                  >
                    Alle Preise
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
