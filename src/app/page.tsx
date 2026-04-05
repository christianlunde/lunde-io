import { FadeIn } from "@/components/FadeIn";
import { LocalClock } from "@/components/LocalClock";
import { NowPlaying } from "@/components/NowPlaying";
import { WeeklyCycling } from "@/components/WeeklyCycling";

export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6">
      <FadeIn>
        <NowPlaying />
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="mt-2">
          <WeeklyCycling />
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="mt-3 font-mono text-xs text-brand-muted/60">
          <LocalClock />
        </div>
      </FadeIn>
    </section>
  );
}
