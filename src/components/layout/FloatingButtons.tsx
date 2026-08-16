"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, Home, MessageSquareText } from "lucide-react";
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

      {/* Back to Home Button - Only show on non-homepage */}
      {!isHomePage && (
        <div className="fixed bottom-20 left-3 md:bottom-6 md:left-6 z-50">
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 md:w-14 md:h-14 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 rounded-full shadow-lg transition-colors"
            aria-label="Zurück zur Startseite"
          >
            <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </Link>
        </div>
      )}

      {/* Right side buttons - Mobile optimized */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-center gap-3">
        {/* Clearly labelled request button */}
        <button
          type="button"
          onClick={handleContactClick}
          className="floating-liquid-orb group flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full text-sky-800 transition-all active:scale-95"
          aria-label="Anfrageformular öffnen"
        >
          <span className="floating-liquid-orb__core flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full">
            <MessageSquareText className="w-6 h-6 text-sky-700" />
          </span>
        </button>

        {/* Phone Button */}
        <button
          type="button"
          onClick={handlePhoneClick}
          className="floating-liquid-orb group flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full text-white transition-all active:scale-95"
          aria-label="Jetzt anrufen"
        >
          <span className="floating-liquid-orb__core flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full">
            <Phone className="w-6 h-6 text-sky-700" />
          </span>
        </button>
      </div>
    </>
  );
}
