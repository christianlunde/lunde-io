import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocalClock } from "@/components/LocalClock";
import { HeroStatus } from "@/components/HeroStatus";
import { getProjects, getJournalPosts, getAbout } from "@/sanity/queries";

export default async function Home() {
  const [projects, posts, about] = await Promise.all([
    getProjects(),
    getJournalPosts(),
    getAbout(),
  ]);

  const recentPosts = posts.slice(0, 3);
  const career = about?.career || [];

  return (
    <>
      {/* Header */}
      <Header />

      {/* Hero — full viewport */}
      <section className="flex min-h-[calc(100dvh-72px)] flex-col justify-between px-6 pb-8 sm:px-12 sm:pb-10">
        <div />

        <FadeIn>
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              Product designer building
              <br />
              thoughtful digital products.
            </h1>
            <HeroStatus />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm font-mono">
              <LocalClock />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Content sections */}
      <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-12">
        {/* Clients */}
        <section className="pt-20">
          <FadeIn>
            <h2 className="font-mono text-sm text-brand-muted">Selected clients</h2>
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-8 items-center opacity-60">
              {[
                "BBC", "Gjensidige", "Norsk Tipping", "Meny",
                "Huma", "Fæbrik", "Sony Music", "Uber",
              ].map((name) => (
                <div
                  key={name}
                  className="flex h-10 items-center justify-center font-heading font-bold text-sm text-brand-dark/50"
                >
                  {name}
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* About */}
        <section className="pt-20">
          <FadeIn>
            <h2 className="font-mono text-sm text-brand-muted">About</h2>
            <p className="mt-6 font-mono text-sm leading-relaxed text-brand-muted">
              Product designer with 10+ years of experience building digital
              products for clients like Uber, Apple, Sony Music and Philips.
              Focused on MVPs, design systems and behavioral design. Hyper
              Island alum, Friends of Figma Norway lead, and UX Norge
              contributor.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block font-mono text-sm text-brand-dark underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Read more
            </Link>
          </FadeIn>
        </section>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="pt-20">
            <FadeIn>
              <h2 className="font-mono text-sm text-brand-muted">Projects</h2>
              <ul className="mt-6 space-y-4">
                {projects.map((project: { _id: string; title: string; description?: string; url?: string }) => (
                  <li key={project._id}>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-baseline gap-3"
                      >
                        <span className="font-heading font-bold group-hover:underline underline-offset-4">
                          {project.title}
                        </span>
                        {project.description && (
                          <span className="font-mono text-sm text-brand-muted">
                            {project.description}
                          </span>
                        )}
                        <span className="font-mono text-xs text-brand-muted">↗</span>
                      </a>
                    ) : (
                      <div className="flex items-baseline gap-3">
                        <span className="font-heading font-bold">
                          {project.title}
                        </span>
                        {project.description && (
                          <span className="font-mono text-sm text-brand-muted">
                            {project.description}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </section>
        )}

        {/* Journal */}
        {recentPosts.length > 0 && (
          <section className="pt-20">
            <FadeIn>
              <div className="flex items-baseline justify-between">
                <h2 className="font-mono text-sm text-brand-muted">Journal</h2>
                <Link
                  href="/journal"
                  className="font-mono text-sm text-brand-muted hover:text-brand-dark transition-colors"
                >
                  See all
                </Link>
              </div>
              <ul className="mt-6 space-y-4">
                {recentPosts.map((post: { _id: string; title: string; publishedAt?: string; slug: { current: string } }) => (
                  <li key={post._id}>
                    <Link
                      href={`/journal/${post.slug.current}`}
                      className="group flex items-baseline justify-between gap-4"
                    >
                      <span className="font-heading font-bold group-hover:underline underline-offset-4">
                        {post.title}
                      </span>
                      {post.publishedAt && (
                        <time className="font-mono text-sm text-brand-muted shrink-0" dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </section>
        )}

        {/* Now and Then */}
        <section className="pt-20">
          <FadeIn>
            <h2 className="font-mono text-sm text-brand-muted">Now and Then</h2>
            <ul className="mt-6 space-y-4">
              {[
                { company: "Agens", role: "Head of Design, Partner", year: "2019–2026" },
                { company: "Skillbase", role: "Founder & Designer", year: "2018–2022" },
                { company: "Hyper Island", role: "Digital Media Creative", year: "2016–2018" },
                { company: "Freelance", role: "UX/UI Designer", year: "2014–2019" },
              ].map((role) => (
                <li key={role.company} className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-bold">{role.company}</span>
                    <span className="font-mono text-sm text-brand-muted">
                      · {role.role}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-brand-muted shrink-0">
                    {role.year}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-brand-dark/10">
          <Footer />
        </div>
      </div>
    </>
  );
}
