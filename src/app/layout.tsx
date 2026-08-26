import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Christian Lunde · Designer",
    template: "%s · Christian Lunde",
  },
  description: "Product designer building thoughtful digital products.",
};

const themeScript = `
(function() {
  var theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  function heroReady() { document.documentElement.classList.add('hero-img-ready'); }
  function heroScan() {
    var im = document.querySelector('img.hero-img');
    if (im && im.complete && im.naturalWidth > 0) heroReady();
  }
  // Covers every ordering: image loads after us (capture listener), image
  // already complete when we run (scan), or we run mid-parse (DCL scan).
  document.addEventListener('load', function(e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.classList && t.classList.contains('hero-img')) heroReady();
  }, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', heroScan);
  } else {
    heroScan();
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-brand text-brand-dark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
