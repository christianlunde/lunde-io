"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FadeIn } from "@/components/FadeIn";
import { NowPlaying } from "@/components/NowPlaying";
import { WeatherPlace, Clock } from "@/components/LocalStatus";
import lofoten from "@/images/lofoten.jpg";
import lofotenVertical from "@/images/lofoten-vertical.jpg";
import { lofotenBlur, lofotenVerticalBlur } from "@/images/blurs";

const projects = [
  { name: "orgnummer", href: "https://orgnummer.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "leverkongen", href: "https://leverkongen.no" },
];

/**
 * Art-directed hero with a hand-rolled blur-up: the documented
 * getImageProps + <picture> pattern cannot use next/image's placeholder,
 * so a ~600-byte inline copy of each frame is painted in the very first
 * frame (no blue flash), and the real photo fades in over one second once
 * decoded. `onReady` fires at that point so the page choreography can
 * start on a settled canvas.
 */
function HeroPicture({ onReady }: { onReady: () => void }) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Visual reveal is handled pre-hydration by the theme script's load
  // listener (html.hero-img-ready); React only gates the choreography.
  // A cached image can be complete before hydration — onLoad never fires.
  useEffect(() => {
    if (imgRef.current?.complete) onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <>
      {/* Blur-up placeholders — server-rendered, so they paint immediately */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden scale-110 blur-2xl sm:block"
        style={{
          backgroundImage: `url(${lofotenBlur})`,
          backgroundSize: "cover",
          backgroundPosition: "28% 48%",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 blur-2xl sm:hidden"
        style={{
          backgroundImage: `url(${lofotenVerticalBlur})`,
          backgroundSize: "cover",
          backgroundPosition: "28% 48%",
        }}
      />
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        <source media="(max-width: 639px)" srcSet={mobile} />
        <img
          ref={imgRef}
          {...rest}
          onLoad={onReady}
          className="hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out"
          style={{ objectPosition: "28% 48%" }}
        />
      </picture>
    </>
  );
}

// Muted slate-navy for the top bar and the center line (owner choice);
// dark ink over the bright sky needs no shadow, so both opt out of the
// section-level white-text glow. The footer stays white over the dark grass.
const inkOverSky = {
  "--brand-muted": "rgb(40 57 92)",
  textShadow: "none",
} as CSSProperties;

/**
 * Sequences the entrance on a settled canvas: blur placeholder → photo
 * fades in (heroReady) → center line rises → header and footer fade
 * calmly once the typewriter has finished (never less than 1.5s after
 * the photo, covering the center's own rise). A fallback timer starts
 * the choreography over the blurred placeholder on very slow networks
 * rather than holding the page hostage. Once revealed, chrome stays put
 * through later song changes.
 */
export function HomeShell() {
  const [heroReady, setHeroReady] = useState(false);
  const [typeStable, setTypeStable] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!heroReady) return;
    const t = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(t);
  }, [heroReady]);

  useEffect(() => {
    if (heroReady && typeStable && minTimePassed && !revealed) setRevealed(true);
  }, [heroReady, typeStable, minTimePassed, revealed]);

  return (
    <>
      <HeroPicture onReady={() => setHeroReady(true)} />
      {/* Bottom scrim only — the white footer needs it over the grass; the
          top bar is dark ink now and reads clean against the bare sky */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Top bar: weather + place | Instagram | clock */}
      <FadeIn
        play={revealed}
        delay={0.15}
        y={0}
        duration={0.9}
        style={inkOverSky}
        className="relative grid grid-cols-3 items-start font-mono text-xs text-brand-muted"
      >
        <WeatherPlace />
        <a
          href="https://www.instagram.com/christianlunde"
          target="_blank"
          rel="noopener"
          className="justify-self-center underline-offset-4 transition-opacity hover:underline"
        >
          Instagram
        </a>
        <span className="justify-self-end">
          <Clock />
        </span>
      </FadeIn>

      {/* Center line lives in the sky band, in the same slate-navy ink as
          the top bar — measured ~7:1 against the sky pixels, no shadow */}
      <div
        style={inkOverSky}
        className="relative flex flex-1 items-start justify-center pt-[13dvh] sm:pt-[15dvh]"
      >
        <FadeIn play={heroReady} delay={0.25} y={10} duration={0.9}>
          <NowPlaying onStableChange={setTypeStable} />
        </FadeIn>
      </div>

      <FadeIn play={revealed} delay={0.5} y={0} duration={0.9} className="relative">
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
    </>
  );
}
