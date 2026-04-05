import type { Metadata } from "next";
import { getAbout } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextRenderer } from "@/components/PortableText";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About",
};

export default async function OmPage() {
  const about = await getAbout();

  if (!about) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          About
        </h1>
        <p className="mt-4 font-mono text-brand-muted">
          Content coming soon. Add info in Sanity Studio.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
      <FadeIn>
        {about.profileImage && (
          <Image
            src={urlFor(about.profileImage).width(120).height(120).url()}
            alt={about.name}
            width={120}
            height={120}
            className="rounded-full object-cover w-20 h-20 sm:w-24 sm:h-24"
            priority
          />
        )}

        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight">
          {about.name}
        </h1>

        {about.tagline && (
          <p className="mt-2 font-mono text-brand-muted">
            {about.tagline}
          </p>
        )}
      </FadeIn>

      {about.bio && (
        <FadeIn delay={0.1}>
          <div className="mt-10">
            <PortableTextRenderer value={about.bio} />
          </div>
        </FadeIn>
      )}

      {about.skills && about.skills.length > 0 && (
        <FadeIn delay={0.15}>
          <div className="mt-10">
            <h2 className="font-mono text-sm text-brand-muted">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {about.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-full border border-brand-dark/20 px-3 py-1 font-mono text-xs text-brand-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {about.career && about.career.length > 0 && (
        <FadeIn delay={0.2}>
          <div className="mt-14">
            <h2 className="font-mono text-sm text-brand-muted">Now and Then</h2>
            <ul className="mt-6 space-y-6">
              {about.career.map((role: { company: string; role?: string; year?: string; description?: string; _key: string }) => (
                <li key={role._key}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
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
          </div>
        </FadeIn>
      )}
    </section>
  );
}
