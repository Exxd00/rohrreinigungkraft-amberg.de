import { Metadata } from "next";
import ContactForm from "@/components/home/ContactForm";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Kontakt | Rohrreinigung Kraft - 24/7 Notdienst",
  description: `Kontaktieren Sie Rohrreinigung Kraft für professionelle Rohrreinigung in Amberg. 24/7 Notdienst: ${company.contact.phoneDisplay}`,
};

export default function KontaktPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-[#F4F9FD] via-white to-[#EBF1F7] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-gradient">Kontakt</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Haben Sie Fragen oder benötigen Sie schnelle Hilfe? Kontaktieren
              Sie uns - wir sind 24/7 für Sie da!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Component */}
      <ContactForm />
    </>
  );
}
