import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getTopArtists,
  getTopTracks,
  getRecentlyPlayed,
  type TimeRange,
} from "@/lib/spotify";
import { SpotifyTopArtists } from "@/components/SpotifyTopArtists";
import { SpotifyTopTracks } from "@/components/SpotifyTopTracks";
import { RecentlyPlayed } from "@/components/RecentlyPlayed";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Music",
};

const VALID_RANGES = new Set(["short_term", "medium_term", "long_term"]);

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MusicPage({ searchParams }: Props) {
  const params = await searchParams;
  const rangeParam = typeof params.range === "string" ? params.range : "medium_term";
  const range: TimeRange = VALID_RANGES.has(rangeParam)
    ? (rangeParam as TimeRange)
    : "medium_term";

  const [artists, tracks, recent] = await Promise.all([
    getTopArtists(range),
    getTopTracks(range),
    getRecentlyPlayed(),
  ]);

  const rangeLabel =
    range === "short_term"
      ? "Last 4 weeks"
      : range === "long_term"
        ? "All time"
        : "Last 6 months";

  return (
    <section className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Music
        </h1>
        <p className="mt-3 font-mono text-brand-muted">
          What I've been listening to.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-8">
          <Suspense>
            <TimeRangeSelector />
          </Suspense>
        </div>
      </FadeIn>

      {artists.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="mt-14">
            <h2 className="font-mono text-sm text-brand-muted mb-6">
              Top artists — {rangeLabel.toLowerCase()}
            </h2>
            <SpotifyTopArtists artists={artists} />
          </div>
        </FadeIn>
      )}

      {tracks.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="mt-14">
            <h2 className="font-mono text-sm text-brand-muted mb-4">
              Top tracks — {rangeLabel.toLowerCase()}
            </h2>
            <SpotifyTopTracks tracks={tracks} />
          </div>
        </FadeIn>
      )}

      {recent.length > 0 && (
        <FadeIn delay={0.25}>
          <div className="mt-14">
            <h2 className="font-mono text-sm text-brand-muted mb-4">
              Recently played
            </h2>
            <RecentlyPlayed items={recent} />
          </div>
        </FadeIn>
      )}
    </section>
  );
}
