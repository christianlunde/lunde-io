import type { Metadata } from "next";

// The embedded CMS admin is public by necessity (auth happens inside
// Sanity), but it has no business in a search index.
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
