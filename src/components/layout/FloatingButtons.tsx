"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, Home, Zap } from "lucide-react";
import { company } from "@/data/company";
import { trackCTAClick } from "@/lib/tracking";
import CallConfirmModal from "./CallConfirmModal";

export default function FloatingButtons() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const handlePhoneClick = () => {
    setIsCallModalOpen(true);
  };

  const handleContactClick = () => {
    trackCTAClick("contact_form", "floating_button");
    const contactSection = document.getElementById("kontakt");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/kontakt";
    }
  };

  return (
    <>
      {/* Call Confirmation Modal */}
      <CallConfirmModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        source="floating_button"
      />

      {/* Mobile: full-width sticky bottom call bar — the dominant action for
          urgent-intent visitors is one thumb-tap away, not a small icon they
          have to decode. Desktop keeps the original floating round buttons. */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch bg-gray-900/97 backdrop-blur border-t border-white/10 shadow-[0_-6px_20px_rgba(0,0,0,0.3)] md:hidden">
        {!isHomePage && (
          <Link
            href="/"
            className="flex items-center justify-center w-14 shrink-0 bg-gray-800 active:bg-gray-700 transition-colors border-r border-white/10"
            aria-label="Zurück zur Startseite"
          >
            <Home className="w-5 h-5 text-white" />
          </Link>
        )}
        <button
          type="button"
          onClick={handleContactClick}
          className="flex items-center justify-center w-14 shrink-0 bg-gray-800 active:bg-gray-700 transition-colors border-r border-white/10"
          aria-label="Soforthilfe anfordern"
        >
          <Zap className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={handlePhoneClick}
          className="flex-1 flex items-center justify-center gap-2 gradient-primary active:opacity-90 transition-opacity py-4"
          aria-label="Jetzt anrufen"
        >
          <Phone className="w-5 h-5 text-white shrink-0" />
          <span className="text-white font-bold text-base tracking-tight">
            Jetzt anrufen · {company.contact.phoneDisplay}
          </span>
        </button>
      </div>

      {/* Desktop: floating round buttons (unchanged) */}
      <div className="hidden md:block">
        {!isHomePage && (
          <div className="fixed bottom-6 left-6 z-50">
            <Link
              href="/"
              className="flex items-center justify-center w-14 h-14 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 rounded-full shadow-lg transition-colors"
              aria-label="Zurück zur Startseite"
            >
              <Home className="w-6 h-6 text-white" />
            </Link>
          </div>
        )}

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Soforthilfe Button */}
          <button
            type="button"
            onClick={handleContactClick}
            className="flex items-center justify-center w-14 h-14 gradient-primary rounded-full shadow-lg shadow-primary/30 transition-colors active:scale-95"
            aria-label="Soforthilfe anfordern"
          >
            <Zap className="w-6 h-6 text-white" />
          </button>

          {/* Phone Button */}
          <button
            type="button"
            onClick={handlePhoneClick}
            className="flex items-center justify-center px-5 py-3 bg-[#F97316] rounded-full shadow-lg shadow-[#F97316]/30 transition-colors active:scale-95"
            aria-label="Jetzt anrufen"
          >
            <Phone className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-sm ml-2">Anrufen</span>
          </button>
        </div>
      </div>
    </>
  );
}
