import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/leistungen",
  },
};

export default function LeistungenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
