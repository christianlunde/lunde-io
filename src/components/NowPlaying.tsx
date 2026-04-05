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

export function NowPlaying() {
  const [track, setTrack] = useState<TrackData | null>(null);

  useEffect(() => {
    let active = true;

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

    fetchTrack();
    const interval = setInterval(fetchTrack, 30_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!track) {
    return (
      <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
        Currently exploring what&apos;s next.
      </p>
    );
  }

  return (
    <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
      Currently exploring what&apos;s next
      <br />
      while listening to{" "}
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-brand-dark transition-colors"
      >
        {track.title}
      </a>
      .
    </p>
  );
}
