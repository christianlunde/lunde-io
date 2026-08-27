"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FadeIn } from "@/components/FadeIn";
import { NowPlaying } from "@/components/NowPlaying";
import { WeatherPlace, Clock } from "@/components/LocalStatus";
import lofoten from "@/images/lofoten.jpg";
import lofotenVertical from "@/images/lofoten-vertical.jpg";
import { lofotenBlur, lofotenVerticalBlur } from "@/images/blurs";

// Alphabetical by name
const projects = [
  { name: "leverkongen", href: "https://leverkongen.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "orgnummer", href: "https://orgnummer.no" },
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
      {/* Progressive blur toward the bottom edge: stacked backdrop layers
          with increasing radius and staggered masks — one masked layer only
          fades a uniform blur in; the stack is what reads as progressive */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
        {[
          [1, 0, 45],
          [2, 25, 60],
          [4, 45, 75],
          [8, 65, 90],
        ].map(([radius, from, to]) => (
          <div
            key={radius}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${radius}px)`,
              WebkitBackdropFilter: `blur(${radius}px)`,
              maskImage: `linear-gradient(to bottom, transparent ${from}%, black ${to}%)`,
              WebkitMaskImage: `linear-gradient(to bottom, transparent ${from}%, black ${to}%)`,
            }}
          />
        ))}
      </div>
      {/* Softer scrim on top of the blur — the blur now carries part of the
          separation, so the darkening can back off */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Top bar: weather + place | Instagram | clock */}
      <FadeIn
        play={revealed}
        delay={0.15}
        y={0}
        duration={0.9}
        style={inkOverSky}
        className="relative grid grid-cols-3 items-start font-mono text-xs font-medium text-brand-muted"
      >
        <WeatherPlace />
        <a
          href="https://www.instagram.com/christianlunde"
          target="_blank"
          rel="noopener"
          className="-m-3.5 justify-self-center p-3.5 underline-offset-4 transition-opacity hover:underline focus-visible:underline sm:m-0 sm:p-0"
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
        <FadeIn play={heroReady} delay={0.25} y={0} duration={1.1}>
          <NowPlaying onStableChange={setTypeStable} />
        </FadeIn>
      </div>

      <FadeIn play={revealed} delay={0.5} y={0} duration={0.9} className="relative">
        <nav aria-label="Latest projects" className="text-center">
          <p className="font-mono text-xs font-medium text-brand-muted">
            Latest projects
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono">
            {projects.map((project) => (
              <a
                key={project.href}
                href={project.href}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-4 py-1.5 text-xs text-white/80 transition duration-200 ease-out hover:border-white/90 hover:bg-white/10 hover:text-white focus-visible:border-white/90 focus-visible:bg-white/10 focus-visible:text-white motion-safe:hover:-translate-y-px motion-safe:hover:scale-[1.03] sm:min-h-0 sm:px-3"
              >
                {project.name}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>
    </>
  );
}
