"use client";

import { useEffect, useState } from "react";
import { TypewriterText } from "./TypewriterText";
import { AlbumHover } from "./AlbumHover";

interface TrackData {
  title: string;
  songUrl: string;
  albumArt: string;
}

interface CyclingData {
  km: number;
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

export function NowPlaying() {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [cycling, setCycling] = useState<CyclingData | null>(null);

  useEffect(() => {
    let active = true;

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
          setCycling({ km: data.km });
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

  if (!hasMusic && !hasCycling) {
    return (
      <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
        Currently exploring what&apos;s next.
      </p>
    );
  }

  return (
    <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
      Currently exploring what&apos;s next
      {hasCycling && (
        <>
          {" "}on my bike ({cycling.km} km this week)
        </>
      )}
      {hasMusic && (
        <>
          {" "}while listening to{" "}
          <AlbumHover albumArt={track.albumArt} songUrl={track.songUrl}>
            <TypewriterText text={track.title} />
          </AlbumHover>
        </>
      )}
      .
    </p>
  );
}
