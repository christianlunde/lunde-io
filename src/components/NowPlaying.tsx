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

export function NowPlaying({ onStableChange }: { onStableChange?: (stable: boolean) => void } = {}) {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [cycling, setCycling] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

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

  const { text: suffixText, rich: suffixRich } = buildSuffix(track, cycling);

  return (
    <p className="font-mono text-[15px] tracking-wide text-brand-muted text-center whitespace-pre-line">
      Currently exploring what’s next
      <TypewriterText text={suffixText} onStableChange={onStableChange}>{suffixRich}</TypewriterText>
    </p>
  );
}
