interface Props {
  url: string;
}

function extractPlaylistId(url: string): string | null {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

export function TravelSoundtrack({ url }: Props) {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) return null;

  return (
    <div className="mt-12">
      <h2 className="font-mono text-sm text-brand-muted mb-4">
        Travel soundtrack
      </h2>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        title="Spotify playlist"
      />
    </div>
  );
}
