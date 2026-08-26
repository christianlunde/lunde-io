import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { HomeShell } from "@/components/HomeShell";
import lofoten from "@/images/lofoten.jpg";
import lofotenVertical from "@/images/lofoten-vertical.jpg";

// Recolors every text token inside the section so the shared components
// render in white over the photo; the soft shadow keeps the mono text
// legible where the frame is bright.
const overPhoto = {
  "--brand-muted": "rgba(255,255,255,0.92)",
  "--brand-dark": "#ffffff",
  textShadow: "0 1px 14px rgba(0, 22, 46, 0.45)",
} as CSSProperties;

/**
 * Art-directed hero: the landscape frame on wide screens, the portrait
 * companion shot on narrow ones (documented getImageProps + <picture>
 * pattern; blur placeholder is not supported down this path).
 */
function HeroPicture() {
  const common = {
    alt: "Christian sitting on a ridge in Lofoten at dusk",
    sizes: "100vw",
    priority: true,
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: lofoten });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: lofotenVertical });

  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={desktop} />
      <source media="(max-width: 639px)" srcSet={mobile} />
      <img
        {...rest}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "28% 48%" }}
      />
    </picture>
  );
}

export default function Home() {
  return (
    <section
      style={overPhoto}
      className="relative flex min-h-dvh flex-col px-6 py-6 sm:px-10 sm:py-8"
    >
      <HomeShell hero={<HeroPicture />} />
    </section>
  );
}
