import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/staedte",
  },
};

export default function StaedteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
