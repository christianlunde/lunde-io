import Image from "next/image";
import type { SpotifyTrack } from "@/lib/spotify";

interface Props {
  tracks: SpotifyTrack[];
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifyTopTracks({ tracks }: Props) {
  if (tracks.length === 0) return null;

  return (
    <ol className="space-y-3">
      {tracks.map((track, i) => (
        <li key={track.id}>
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg p-1.5 -mx-1.5 transition-colors hover:bg-brand-dark/5"
          >
            <span className="w-5 text-right font-mono text-xs text-brand-muted shrink-0">
              {i + 1}
            </span>
            {track.album.images[0] && (
              <Image
                src={track.album.images[0].url}
                alt=""
                width={40}
                height={40}
                className="rounded-sm shrink-0"
                sizes="40px"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold tracking-tight group-hover:underline">
                {track.name}
              </p>
              <p className="truncate font-mono text-xs text-brand-muted">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <span className="font-mono text-xs text-brand-muted shrink-0">
              {formatDuration(track.duration_ms)}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
