import type { Metadata } from "next";
import { getDestinations } from "@/sanity/queries";
import { DestinationCard } from "@/components/DestinationCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Places",
  description: "10 favourites from each city I've visited.",
};

export default async function PlacesPage() {
  const destinations = await getDestinations();

  return (
    <div className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Places
        </h1>
        <p className="mt-2 font-mono text-sm text-brand-muted">
          10 favourites from each city I&apos;ve visited.
        </p>
      </FadeIn>

      {destinations.length === 0 ? (
        <FadeIn delay={0.1}>
          <p className="mt-12 font-mono text-sm text-brand-muted">
            No destinations yet — check back soon.
          </p>
        </FadeIn>
      ) : (
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {destinations.map(
            (
              dest: {
                _id: string;
                title: string;
                slug: { current: string };
                country?: string;
                excerpt?: string;
                placeCount?: number;
                coverImage?: {
                  asset: { _id: string; metadata?: { lqip?: string } };
                  alt?: string;
                };
              },
              i: number
            ) => (
              <FadeIn key={dest._id} delay={0.1 + 0.1 * i}>
                <DestinationCard
                  title={dest.title}
                  slug={dest.slug}
                  country={dest.country}
                  excerpt={dest.excerpt}
                  placeCount={dest.placeCount}
                  coverImage={dest.coverImage}
                />
              </FadeIn>
            )
          )}
        </div>
      )}
    </div>
  );
}
