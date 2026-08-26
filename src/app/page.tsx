import { FadeIn } from "@/components/FadeIn";
import { NowPlaying } from "@/components/NowPlaying";
import { LocalStatus } from "@/components/LocalStatus";

const projects = [
  { name: "orgnummer", href: "https://orgnummer.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "leverkongen", href: "https://leverkongen.no" },
];

export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col px-6 py-6 sm:px-10 sm:py-8">
      <FadeIn
        delay={0.7}
        y={0}
        duration={0.6}
        className="flex items-start justify-between font-mono text-xs text-brand-muted"
      >
        <a
          href="https://www.instagram.com/christianlunde"
          target="_blank"
          rel="noopener"
          className="underline-offset-4 transition-opacity hover:underline"
        >
          Instagram
        </a>
        <LocalStatus />
      </FadeIn>

      <div className="flex flex-1 items-center justify-center py-16">
        <FadeIn delay={0.1} y={10} duration={0.9}>
          <NowPlaying />
        </FadeIn>
      </div>

      <FadeIn delay={1} y={0} duration={0.6}>
        <nav aria-label="Latest projects" className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
            Latest projects
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-brand-muted">
            {projects.map((project, i) => (
              <span key={project.href} className="whitespace-nowrap">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener"
                  className="underline-offset-4 transition-opacity hover:underline"
                >
                  {project.name}
                </a>
                {i < projects.length - 1 && (
                  <span aria-hidden="true" className="ml-3 select-none text-brand-muted/40">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </nav>
      </FadeIn>

    </section>
  );
}
