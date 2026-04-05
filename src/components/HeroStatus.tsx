"use client";

import { useEffect, useState } from "react";

interface TrackData {
  title: string;
  songUrl: string;
}

interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  songUrl?: string;
}

interface WeeklyResponse {
  km: number;
}

export function HeroStatus() {
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
            setTrack({ title: data.title, songUrl: data.songUrl });
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
    const interval = setInterval(fetchTrack, 30_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const hasMusic = !!track;
  const hasCycling = !!cycling;
  const hasActivity = hasMusic || hasCycling;

  // Before mount, show static fallback to avoid hydration mismatch
  if (!mounted) {
    return (
      <p className="mt-5 text-sm leading-relaxed font-mono sm:text-base sm:mt-6">
        Currently exploring what&apos;s next.
        <br />
        Previously Head of Design at{" "}
        <a
          href="https://agens.no"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Agens
        </a>
        .
      </p>
    );
  }

  return (
    <p className="mt-5 text-sm leading-relaxed font-mono sm:text-base sm:mt-6">
      Currently exploring what&apos;s next
      {hasCycling && <> on my bike ({cycling} km this week)</>}
      {hasMusic && (
        <>
          {" "}while listening to{" "}
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            {track.title}
          </a>
        </>
      )}
      .
      {!hasActivity && (
        <>
          <br />
          Previously Head of Design at{" "}
          <a
            href="https://agens.no"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Agens
          </a>
          .
        </>
      )}
    </p>
  );
}
