"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TypewriterText } from "./TypewriterText";
import { AlbumHover } from "./AlbumHover";

interface TrackData {
  title: string;
  songUrl: string;
  albumArt: string;
}

interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  songUrl?: string;
  albumArt?: string;
}

interface WeeklyResponse {
  km: number;
}

// Status line rotation (owner-curated). Every NEW visitor sees the classic
// first; later loads pick randomly among the others, never repeating the
// line shown last time. Stored in localStorage so "first visit" survives
// sessions; all storage access is fail-soft (private mode etc.).
// Cycling in the status line is switched off (2026-08-30): combined with
// the rotating lines it read clunky ("Out exploring on my bike (48 km…)").
// All the plumbing - buildSuffix branches, /api/strava/weekly, lib/strava -
// is kept intact; flip this to true to bring it back.
const CYCLING_ENABLED = false;

const CLASSIC = "Currently exploring what’s next";
const LINES = [
  "Building small things",
  "Out exploring",
  CLASSIC,
  "Working on something",
  "Taking the scenic route",
];

function chooseStatusLine(): string {
  try {
    if (!localStorage.getItem("statusline-seen")) return CLASSIC;
    const last = localStorage.getItem("statusline-last");
    const pool = LINES.filter((l) => l !== last);
    return pool[Math.floor(Math.random() * pool.length)];
  } catch {
    return CLASSIC;
  }
}

function persistStatusLine(line: string) {
  try {
    localStorage.setItem("statusline-seen", "1");
    localStorage.setItem("statusline-last", line);
  } catch {
    // Non-critical
  }
}

/** Structures an in-flight typewriter frame so the partially typed (or
 *  erased) song title lives in the same inline-block as the finished
 *  markup — it grows on its own line instead of typing on line one and
 *  jumping down when the rich render takes over. */
function renderSuffixPartial(display: string): ReactNode {
  const m = display.match(/^( while listening to )(.*)$/);
  if (!m) return display;
  const [, phrase, rest] = m;
  const hasDot = rest.endsWith(".");
  const title = hasDot ? rest.slice(0, -1) : rest;
  return (
    <>
      {phrase}
      <span className="inline-block">{title}</span>
      {hasDot ? "." : ""}
    </>
  );
}

function buildSuffix(
  track: TrackData | null,
  km: number | null
): { text: string; rich: ReactNode } {
  const hasMusic = !!track;
  const hasCycling = km !== null && km > 0;

  if (hasMusic && hasCycling) {
    return {
      text: ` on my bike (${km} km this week) while listening to ${track!.title}.`,
      rich: (
        <>
          {" "}on my bike ({km} km this week) while listening to{" "}
          {/* inline-block: the title wraps to the next line as one unit
              instead of splitting mid-title; it only breaks internally if
              the title alone is wider than the viewport */}
          <span className="inline-block">
            <AlbumHover albumArt={track!.albumArt} songUrl={track!.songUrl}>
              {track!.title}
            </AlbumHover>
          </span>
          .
        </>
      ),
    };
  }
  if (hasMusic) {
    return {
      text: ` while listening to ${track!.title}.`,
      rich: (
        <>
          {" "}while listening to{" "}
          {/* inline-block: the title wraps to the next line as one unit
              instead of splitting mid-title; it only breaks internally if
              the title alone is wider than the viewport */}
          <span className="inline-block">
            <AlbumHover albumArt={track!.albumArt} songUrl={track!.songUrl}>
              {track!.title}
            </AlbumHover>
          </span>
          .
        </>
      ),
    };
  }
  if (hasCycling) {
    return {
      text: ` on my bike (${km} km this week).`,
      rich: <> on my bike ({km} km this week).</>,
    };
  }
  return {
    text: `.`,
    rich: <>.</>,
  };
}

export function NowPlaying({
  onStableChange,
  revealed = true,
}: {
  onStableChange?: (stable: boolean) => void;
  /** While false the suffix is held back, so the typewriter performs on
   *  stage after the line has faded in instead of finishing invisibly
   *  before the reveal. Data is fetched regardless, so typing starts the
   *  moment this flips. */
  revealed?: boolean;
} = {}) {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [cycling, setCycling] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // Chosen synchronously in the first client render (SSR always carries the
  // classic; suppressHydrationWarning covers the text swap) so no painted
  // frame can ever show a different line than the one that stays.
  const [prefix] = useState(() =>
    typeof window === "undefined" ? CLASSIC : chooseStatusLine(),
  );

  useEffect(() => {
    persistStatusLine(prefix);
  }, [prefix]);

  useEffect(() => {
    let active = true;
    setMounted(true);

    async function fetchTrack() {
      try {
        const res = await fetch("/api/spotify/now-playing");
        if (!res.ok) return;
        const data: NowPlayingResponse = await res.json();
        if (active) {
          if (data.isPlaying && data.title && data.songUrl) {
            setTrack({ title: data.title, songUrl: data.songUrl, albumArt: data.albumArt ?? "" });
          } else {
            setTrack(null);
          }
        }
      } catch {
        // Non-critical
      }
    }

    async function fetchCycling() {
      try {
        const res = await fetch("/api/strava/weekly");
        if (!res.ok) return;
        const data: WeeklyResponse = await res.json();
        if (active && data.km > 0) {
          setCycling(data.km);
        }
      } catch {
        // Non-critical
      }
    }

    fetchTrack();
    if (CYCLING_ENABLED) fetchCycling();
    const interval = setInterval(fetchTrack, 10_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return (
      <p
        suppressHydrationWarning
        className="font-mono text-[15px] tracking-wide text-brand-muted text-center"
      >
        {prefix}.
      </p>
    );
  }

  const { text: suffixText, rich: suffixRich } = buildSuffix(
    revealed ? track : null,
    revealed ? cycling : null,
  );

  return (
    <p
      suppressHydrationWarning
      className="font-mono text-[15px] tracking-wide text-brand-muted text-center whitespace-pre-line"
    >
      {prefix}
      <TypewriterText
        text={suffixText}
        onStableChange={onStableChange}
        renderPartial={renderSuffixPartial}
      >
        {suffixRich}
      </TypewriterText>
    </p>
  );
}
