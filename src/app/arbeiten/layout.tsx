import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/arbeiten",
  },
};

export default function ArbeitenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
