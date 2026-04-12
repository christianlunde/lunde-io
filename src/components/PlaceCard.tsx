import Image from "next/image";
import { urlFor } from "@/sanity/image";

interface PlaceCardProps {
  index: number;
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
}

function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function PlaceCard({
  index,
  title,
  category,
  description,
  address,
  googleMapsUrl,
  publishedAt,
  image,
}: PlaceCardProps) {
  const lqip = image?.asset?.metadata?.lqip;

  return (
    <div className="flex gap-5 sm:gap-8">
      <div className="shrink-0 pt-1">
        <span className="font-heading text-4xl sm:text-5xl font-bold leading-none select-none tabular-nums text-brand-dark/15">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:gap-6">
          {image && (
            <div className="mb-4 sm:mb-0 overflow-hidden rounded-lg sm:w-52 sm:shrink-0">
              <Image
                src={urlFor(image).width(416).height(312).url()}
                alt={image.alt || title}
                width={416}
                height={312}
                sizes="(max-width: 640px) calc(100vw - 96px), 208px"
                placeholder={lqip ? "blur" : "empty"}
                blurDataURL={lqip}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {category && (
              <span className="inline-block font-mono text-xs border border-brand-dark/20 rounded-full px-2.5 py-0.5 text-brand-muted">
                {category}
              </span>
            )}
            <h3 className="mt-2 font-heading text-xl font-bold tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-2 font-mono text-sm text-brand-muted leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-brand-muted">
              {address && <span>{address}</span>}
              {publishedAt && <span>{formatMonthYear(publishedAt)}</span>}
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-dark transition-colors"
                >
                  Open in Maps →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
