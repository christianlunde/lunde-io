import { FadeIn } from "@/components/FadeIn";
import { LocalClock } from "@/components/LocalClock";

export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6">
      <FadeIn>
        <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
          Coming soon
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="mt-3 font-mono text-xs text-brand-muted/60">
          <LocalClock />
        </div>
      </FadeIn>
    </section>
  );
}
