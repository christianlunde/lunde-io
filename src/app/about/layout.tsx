import type { Metadata } from "next";

// Hidden-public while the homepage is still Coming Soon: reachable for
// anyone with the link, but not indexed or followed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function OmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
