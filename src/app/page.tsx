import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocalClock } from "@/components/LocalClock";
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
      {/* Hero — full viewport */}
      <section className="flex min-h-dvh flex-col justify-between px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <FadeIn>
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              Product designer building
              <br />
              thoughtful digital products.
            </h1>
            <p className="mt-5 text-sm leading-relaxed font-mono sm:text-base sm:mt-6">
              Currently exploring what&rsquo;s next.
              <br />
              Former partner at{" "}
              <a
                href="https://agens.no"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Agens
              </a>
              .
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-mono sm:text-base">
              <Link
                href="/journal"
                className="underline-offset-4 hover:underline transition-all"
              >
                Journal
              </Link>
              <a
                href="https://www.instagram.com/christianlunde/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline transition-all"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/chrlunde/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline transition-all"
              >
                LinkedIn
              </a>
            </nav>
            <div className="text-sm font-mono">
              <LocalClock />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Content sections */}
      <div className="mx-auto max-w-2xl px-6 pb-20 sm:px-12">
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
        {career.length > 0 && (
          <section className="pt-20">
            <FadeIn>
              <h2 className="font-mono text-sm text-brand-muted">Now and Then</h2>
              <ul className="mt-6 space-y-6">
                {career.map((role: { company: string; role?: string; year?: string; description?: string; _key: string }) => (
                  <li key={role._key}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-bold">{role.company}</span>
                      {role.role && (
                        <span className="font-mono text-sm text-brand-muted">
                          · {role.role}
                        </span>
                      )}
                      {role.year && (
                        <span className="font-mono text-sm text-brand-muted">
                          · {role.year}
                        </span>
                      )}
                    </div>
                    {role.description && (
                      <p className="mt-1 font-mono text-sm text-brand-muted leading-relaxed">
                        {role.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-brand-dark/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-mono text-sm text-brand-muted">
            <p>&copy; {new Date().getFullYear()} Christian Lunde</p>
            <nav className="flex gap-6">
              <Link href="/journal" className="hover:text-brand-dark transition-colors">
                Journal
              </Link>
              <Link href="/om" className="hover:text-brand-dark transition-colors">
                About
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
