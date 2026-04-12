import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";

interface DestinationCardProps {
  title: string;
  slug: { current: string };
  country?: string;
  excerpt?: string;
  placeCount?: number;
  coverImage?: {
    asset: { _id: string; metadata?: { lqip?: string } };
    alt?: string;
  };
}

export function DestinationCard({
  title,
  slug,
  country,
  excerpt,
  placeCount,
  coverImage,
}: DestinationCardProps) {
  const lqip = coverImage?.asset?.metadata?.lqip;

  return (
    <Link href={`/places/${slug.current}`} className="group block">
      {coverImage && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={urlFor(coverImage).width(720).height(480).url()}
            alt={coverImage.alt || title}
            width={720}
            height={480}
            sizes="(max-width: 640px) 100vw, 50vw"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="mt-4">
        <p className="font-mono text-xs text-brand-muted">
          {country}
          {country && placeCount !== undefined && " · "}
          {placeCount !== undefined && `${placeCount} places`}
        </p>
        <h2 className="mt-1 font-heading text-xl font-bold tracking-tight group-hover:underline">
          {title}
        </h2>
        {excerpt && (
          <p className="mt-1 font-mono text-sm text-brand-muted line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
