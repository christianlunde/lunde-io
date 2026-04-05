import type { Metadata } from "next";
import { getJournalPosts } from "@/sanity/queries";
import { JournalCard } from "@/components/JournalCard";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Journal",
};

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <section className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Journal
        </h1>
        <p className="mt-3 font-mono text-brand-muted">
          Places I explore and thoughts along the way.
        </p>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.1}>
          <p className="mt-12 font-mono text-brand-muted">
            No posts yet. Add content in Sanity Studio.
          </p>
        </FadeIn>
      ) : (
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {posts.map((post: { _id: string; title: string; slug: { current: string }; excerpt?: string; mainImage?: { asset: { _id: string; metadata?: { lqip?: string } }; alt?: string }; location?: string; publishedAt?: string }, i: number) => (
            <FadeIn key={post._id} delay={0.1 * i}>
              <JournalCard {...post} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}
