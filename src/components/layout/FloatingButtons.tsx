"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PhoneCall, Home } from "lucide-react";
import CallConfirmModal from "./CallConfirmModal";

export default function FloatingButtons() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const handlePhoneClick = () => {
    setIsCallModalOpen(true);
  };

  return (
    <>
      {/* Call Confirmation Modal */}
      <CallConfirmModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        source="floating_button"
      />

      {/* Floating round icon buttons — identisch auf Mobil und Desktop.
          Nur ein Icon: der Anruf-Button, bewusst in Rot statt Markenblau,
          damit er als klare Notfall-Handlung heraussticht. */}
      {!isHomePage && (
        <Link
          href="/"
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-secondary hover:opacity-90 rounded-full shadow-lg transition-opacity"
          aria-label="Zurück zur Startseite"
        >
          <Home className="w-6 h-6 text-white" />
        </Link>
      )}

      <button
        type="button"
        onClick={handlePhoneClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-700 shadow-lg shadow-red-600/40 transition-all active:scale-95"
        aria-label="Jetzt anrufen"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping" />
        <PhoneCall className="relative w-7 h-7 text-white" />
      </button>
    </>
  );
}
