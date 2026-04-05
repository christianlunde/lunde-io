"use client";

import { useEffect, useState } from "react";

interface TrackData {
  title: string;
  artist: string;
  songUrl: string;
}

interface NowPlayingResponse {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  songUrl?: string;
}

interface RecentItem {
  track: {
    name: string;
    artists: { name: string }[];
    external_urls: { spotify: string };
  };
}

export function NowPlaying() {
  const [track, setTrack] = useState<TrackData | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchTrack() {
      try {
        // Try currently playing first
        const nowRes = await fetch("/api/spotify/now-playing");
        if (nowRes.ok) {
          const data: NowPlayingResponse = await nowRes.json();
          if (data.isPlaying && data.title && data.artist && data.songUrl) {
            if (active) setTrack({ title: data.title, artist: data.artist, songUrl: data.songUrl });
            return;
          }
        }

        // Fall back to most recently played
        const recentRes = await fetch("/api/spotify/recently-played");
        if (recentRes.ok) {
          const items: RecentItem[] = await recentRes.json();
          if (items.length > 0) {
            const t = items[0].track;
            if (active) setTrack({
              title: t.name,
              artist: t.artists.map(a => a.name).join(", "),
              songUrl: t.external_urls.spotify,
            });
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
