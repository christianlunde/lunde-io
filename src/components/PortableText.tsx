"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-heading text-xl font-bold tracking-tight">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 font-mono leading-relaxed text-brand-muted">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-brand-dark/20 pl-4 font-mono italic text-brand-muted">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: { value: any }) => {
      const lqip = value?.asset?.metadata?.lqip;
      return (
        <figure className="mt-8 mb-4">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            className="rounded-xl w-full"
          />
          {value.alt && (
            <figcaption className="mt-2 font-mono text-xs text-brand-muted text-center">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PortableTextRenderer({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
