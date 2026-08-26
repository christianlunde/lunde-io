import { FadeIn } from "@/components/FadeIn";
import { LocalClock } from "@/components/LocalClock";
import { NowPlaying } from "@/components/NowPlaying";

const tools = [
  { name: "orgnummer", href: "https://orgnummer.no" },
  { name: "opentimer", href: "https://opentimer.no" },
  { name: "openqr", href: "https://openqr.no" },
  { name: "openmessage", href: "https://openmessage.no" },
  { name: "opendraw", href: "https://opendraw.no" },
  { name: "leverkongen", href: "https://leverkongen.no" },
];

export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6">
      <FadeIn>
        <NowPlaying />
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-3 flex flex-col items-center gap-1 font-mono text-xs text-brand-muted">
          <LocalClock />
          <a
            href="https://www.instagram.com/christianlunde"
            target="_blank"
            rel="noopener"
            className="underline-offset-4 transition-opacity hover:underline"
          >
            instagram
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.4} className="mt-14 w-full max-w-xl">
        <nav aria-label="Small tools" className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
            Also building
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-brand-muted">
            {tools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noopener"
                className="underline-offset-4 transition-opacity hover:underline"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>
    </section>
  );
}
