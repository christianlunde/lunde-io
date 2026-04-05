import Image from "next/image";
import type { SpotifyArtist } from "@/lib/spotify";

interface Props {
  artists: SpotifyArtist[];
}

export function SpotifyTopArtists({ artists }: Props) {
  if (artists.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {artists.map((artist) => (
        <a
          key={artist.id}
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-center"
        >
          {artist.images[0] && (
            <Image
              src={artist.images[0].url}
              alt={artist.name}
              width={200}
              height={200}
              className="mx-auto aspect-square rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 45vw, 200px"
            />
          )}
          <p className="mt-3 font-heading text-sm font-bold tracking-tight group-hover:underline">
            {artist.name}
          </p>
          {artist.genres?.[0] && (
            <p className="mt-0.5 font-mono text-xs text-brand-muted">
              {artist.genres[0]}
            </p>
          )}
        </a>
      ))}
    </div>
  );
}
