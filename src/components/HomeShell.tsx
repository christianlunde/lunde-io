"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FadeIn } from "@/components/FadeIn";
import { NowPlaying } from "@/components/NowPlaying";
import { WeatherPlace, Clock } from "@/components/LocalStatus";

const projects = [
  { name: "orgnummer", href: "https://orgnummer.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "leverkongen", href: "https://leverkongen.no" },
];

/**
 * Sequences the entrance: the center line rises first; header and footer
 * hold until the typewriter has finished settling (and never less than
 * 1.4s, covering the center's own rise), then fade calmly into place.
 * The typewriter is data-driven — a song can start typing whenever
 * Spotify answers — so the gate listens to it instead of guessing with
 * fixed delays. Once revealed, chrome stays put through later song
 * changes.
 */
export function HomeShell({ hero }: { hero: ReactNode }) {
  const [typeStable, setTypeStable] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (typeStable && minTimePassed && !revealed) setRevealed(true);
  }, [typeStable, minTimePassed, revealed]);

  return (
    <>
      {hero}
      {/* Subtle scrims top and bottom; the middle of the frame stays clean */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Top bar: weather + place | Instagram | clock */}
      <FadeIn
        play={revealed}
        delay={0.15}
        y={0}
        duration={0.9}
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

      <div className="relative flex flex-1 items-center justify-center py-16">
        <FadeIn delay={0.1} y={10} duration={0.9}>
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
