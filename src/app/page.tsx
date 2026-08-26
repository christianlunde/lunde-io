import type { CSSProperties } from "react";
import { HomeShell } from "@/components/HomeShell";

// Recolors every text token inside the section so the shared components
// render in white over the photo; the soft shadow keeps the mono text
// legible where the frame is bright.
const overPhoto = {
  "--brand-muted": "rgba(255,255,255,0.92)",
  "--brand-dark": "#ffffff",
  textShadow: "0 1px 14px rgba(0, 22, 46, 0.45)",
} as CSSProperties;

export default function Home() {
  return (
    <section
      style={overPhoto}
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-6 sm:px-10 sm:py-8"
    >
      <HomeShell />
    </section>
  );
}
