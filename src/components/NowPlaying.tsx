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
const CLASSIC = "Currently exploring what’s next";
const LINES = [
  "Building small things",
  "Out exploring",
  CLASSIC,
  "Working on something",
  "Taking the scenic route",
];

function pickStatusLine(): string {
  try {
    if (!localStorage.getItem("statusline-seen")) {
      localStorage.setItem("statusline-seen", "1");
      localStorage.setItem("statusline-last", CLASSIC);
      return CLASSIC;
    }
    const last = localStorage.getItem("statusline-last");
    const pool = LINES.filter((l) => l !== last);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    localStorage.setItem("statusline-last", pick);
    return pick;
  } catch {
    return CLASSIC;
  }
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
          <AlbumHover albumArt={track!.albumArt} songUrl={track!.songUrl}>
            {track!.title}
          </AlbumHover>
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
          <AlbumHover albumArt={track!.albumArt} songUrl={track!.songUrl}>
            {track!.title}
          </AlbumHover>
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
  // Classic until mounted so the client's first render matches the SSR HTML;
  // the swap happens while the line is still held invisible by heroReady.
  const [prefix, setPrefix] = useState(CLASSIC);

  useEffect(() => {
    let active = true;
    setMounted(true);
    setPrefix(pickStatusLine());

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
    fetchCycling();
    const interval = setInterval(fetchTrack, 10_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return (
      <p className="font-mono text-[15px] tracking-wide text-brand-muted text-center">
        Currently exploring what’s next.
      </p>
    );
  }

  const { text: suffixText, rich: suffixRich } = buildSuffix(
    revealed ? track : null,
    revealed ? cycling : null,
  );

  return (
    <p className="font-mono text-[15px] tracking-wide text-brand-muted text-center whitespace-pre-line">
      {prefix}
      <TypewriterText text={suffixText} onStableChange={onStableChange}>{suffixRich}</TypewriterText>
    </p>
  );
}
