import type { CSSProperties } from "react";
import { FadeIn } from "@/components/FadeIn";
import { NowPlaying } from "@/components/NowPlaying";
import { LocalStatus } from "@/components/LocalStatus";

import { getImageProps } from "next/image";
import lofoten from "@/images/lofoten.jpg";
import lofotenVertical from "@/images/lofoten-vertical.jpg";

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

const projects = [
  { name: "orgnummer", href: "https://orgnummer.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "leverkongen", href: "https://leverkongen.no" },
];

// Recolors every text token inside the section so the existing components
// render in white over the photo.
const overPhoto = {
  "--brand-muted": "rgba(255,255,255,0.92)",
  "--brand-dark": "#ffffff",
  // Soft shadow keeps white mono text legible where the photo is bright
  textShadow: "0 1px 14px rgba(0, 22, 46, 0.45)",
} as CSSProperties;

export default function FullscreenVariant() {
  return (
    <section
      style={overPhoto}
      className="relative flex min-h-dvh flex-col px-6 py-6 sm:px-10 sm:py-8"
    >
      <HeroPicture />
      {/* Scrim: keeps the mono text legible against sky and sea */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/45" />

      <FadeIn
        delay={0.7}
        y={0}
        duration={0.6}
        className="relative flex items-start justify-between font-mono text-xs text-brand-muted"
      >
        <a
          href="https://www.instagram.com/christianlunde"
          target="_blank"
          rel="noopener"
          className="underline-offset-4 transition-opacity hover:underline"
        >
          Instagram
        </a>
        <LocalStatus />
      </FadeIn>

      <div className="relative flex flex-1 items-center justify-center py-16">
        <FadeIn delay={0.1} y={10} duration={0.9}>
          <NowPlaying />
        </FadeIn>
      </div>

      <FadeIn delay={1} y={0} duration={0.6} className="relative">
        <nav aria-label="Latest projects" className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
            Latest projects
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-brand-muted">
            {projects.map((project, i) => (
              <span key={project.href} className="whitespace-nowrap">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener"
                  className="underline-offset-4 transition-opacity hover:underline"
                >
                  {project.name}
                </a>
                {i < projects.length - 1 && (
                  <span aria-hidden="true" className="ml-3 select-none text-brand-muted/40">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </nav>
      </FadeIn>
    </section>
  );
}
