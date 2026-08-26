import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { HomeShell } from "@/components/HomeShell";
import { TypoLab } from "@/components/TypoLab";
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

export default function Home() {
  // Art-directed preloads: the fetch starts at <head> parse instead of when
  // the parser reaches the <picture> deep in the body. media ensures each
  // viewport only preloads its own frame.
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: lofoten });
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: lofotenVertical });

  return (
    <>
      <link
        rel="preload"
        as="image"
        imageSrcSet={desktopSrcSet}
        imageSizes="100vw"
        media="(min-width: 640px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        imageSrcSet={mobileSrcSet}
        imageSizes="100vw"
        media="(max-width: 639px)"
        fetchPriority="high"
      />
      <section
        style={overPhoto}
        className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-6 sm:px-10 sm:py-8"
      >
        <HomeShell />
        <TypoLab />
      </section>
    </>
  );
}
