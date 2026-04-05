import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";

interface JournalCardProps {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  location?: string;
  publishedAt?: string;
}

export function JournalCard({
  title,
  slug,
  excerpt,
  mainImage,
  location,
  publishedAt,
}: JournalCardProps) {
  return (
    <Link href={`/journal/${slug.current}`} className="group block">
      {mainImage && (
        <div className="overflow-hidden rounded-xl">
          <Image
            src={urlFor(mainImage).width(720).height(480).url()}
            alt={mainImage.alt || title}
            width={720}
            height={480}
            className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="mt-4">
        <div className="flex items-center gap-2 font-mono text-xs text-brand-muted">
          {location && <span>{location}</span>}
          {location && publishedAt && <span>&middot;</span>}
          {publishedAt && (
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
        <h2 className="mt-1 font-heading text-lg font-bold tracking-tight group-hover:underline">
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
