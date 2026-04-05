import Image from "next/image";
import type { SpotifyTrack } from "@/lib/spotify";

interface Props {
  items: { track: SpotifyTrack; played_at: string }[];
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentlyPlayed({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item.track.id}-${i}`}>
          <a
            href={item.track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg p-1.5 -mx-1.5 transition-colors hover:bg-brand-dark/5"
          >
            {item.track.album.images[0] && (
              <Image
                src={item.track.album.images[0].url}
                alt=""
                width={40}
                height={40}
                className="rounded-sm shrink-0"
                sizes="40px"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold tracking-tight group-hover:underline">
                {item.track.name}
              </p>
              <p className="truncate font-mono text-xs text-brand-muted">
                {item.track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <span className="font-mono text-xs text-brand-muted shrink-0">
              {timeAgo(item.played_at)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
