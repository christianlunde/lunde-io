import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getJournalPost, getJournalPosts } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextRenderer } from "@/components/PortableText";
import { FadeIn } from "@/components/FadeIn";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = await getJournalPosts();
  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }));
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <Link
          href="/journal"
          className="font-mono text-sm text-brand-muted hover:text-brand-dark transition-colors"
        >
          &larr; Back to journal
        </Link>

        <header className="mt-8">
          <div className="flex items-center gap-2 font-mono text-sm text-brand-muted">
            {post.location && <span>{post.location}</span>}
            {post.location && post.publishedAt && <span>&middot;</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
        </header>
      </FadeIn>

      {post.mainImage && (
        <FadeIn delay={0.1}>
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.mainImage.alt || post.title}
            width={1200}
            height={675}
            className="mt-8 rounded-xl object-cover w-full"
            priority
          />
        </FadeIn>
      )}

      {post.body && (
        <FadeIn delay={0.2}>
          <div className="mt-10">
            <PortableTextRenderer value={post.body} />
          </div>
        </FadeIn>
      )}

      {post.tags && post.tags.length > 0 && (
        <FadeIn delay={0.3}>
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-brand-dark/20 px-3 py-1 font-mono text-xs text-brand-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </FadeIn>
      )}
    </article>
  );
}
