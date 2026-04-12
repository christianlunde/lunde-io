import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestination, getDestinations } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { FadeIn } from "@/components/FadeIn";
import { PlaceCard } from "@/components/PlaceCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) return {};
  return {
    title: destination.title,
    description: destination.excerpt,
  };
}

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((dest: { slug: { current: string } }) => ({
    slug: dest.slug.current,
  }));
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) notFound();

  const places = destination.places ?? [];

  return (
    <article className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <Link
          href="/places"
          className="font-mono text-sm text-brand-muted hover:text-brand-dark transition-colors"
        >
          &larr; Places
        </Link>

        <header className="mt-8">
          {destination.country && (
            <p className="font-mono text-sm text-brand-muted">
              {destination.country}
            </p>
          )}
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {destination.title}
          </h1>
          {destination.excerpt && (
            <p className="mt-3 font-mono text-sm text-brand-muted leading-relaxed">
              {destination.excerpt}
            </p>
          )}
        </header>
      </FadeIn>

      {destination.coverImage && (
        <FadeIn delay={0.1}>
          <Image
            src={urlFor(destination.coverImage).width(1200).height(675).url()}
            alt={destination.coverImage.alt || destination.title}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder={
              destination.coverImage.asset?.metadata?.lqip ? "blur" : "empty"
            }
            blurDataURL={destination.coverImage.asset?.metadata?.lqip}
            className="mt-8 rounded-xl object-cover w-full"
            priority
          />
        </FadeIn>
      )}

      {places.length > 0 && (
        <div className="mt-16 space-y-16">
          {places.map(
            (
              place: {
                _key: string;
                title: string;
                category?: string;
                description?: string;
                address?: string;
                googleMapsUrl?: string;
                publishedAt?: string;
                image?: {
                  asset: { _id: string; metadata?: { lqip?: string } };
                  alt?: string;
                };
              },
              i: number
            ) => (
              <FadeIn key={place._key} delay={0.05 * i}>
                <PlaceCard
                  index={i}
                  title={place.title}
                  category={place.category}
                  description={place.description}
                  address={place.address}
                  googleMapsUrl={place.googleMapsUrl}
                  publishedAt={place.publishedAt}
                  image={place.image}
                />
              </FadeIn>
            )
          )}
        </div>
      )}
    </article>
  );
}
