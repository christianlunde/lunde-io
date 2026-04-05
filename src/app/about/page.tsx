import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About",
};

const career = [
  {
    company: "Agens",
    role: "Head of Design, Partner",
    year: "2019–2026",
    description:
      "Led design strategy, recruited talent, and aligned design with company goals. Board member. Clients included Gjensidige, Norgesgruppen, Fæbrik and BBC.",
  },
  {
    company: "Friends of Figma",
    role: "Community Leader",
    year: "2020–",
    description:
      "Leading Norway's largest Figma community. Organizing events and maintaining contact with Figma staff in the US.",
  },
  {
    company: "Skillbase",
    role: "CEO & Co-founder",
    year: "2018–2022",
    description:
      "Built a digital platform for competency mapping and development. Supported by Innovation Norway.",
  },
  {
    company: "Freelance",
    role: "Designer & Photographer",
    year: "2014–2019",
    description:
      "Clients included Nordic Choice Hotels, Marcus & Martinus, and various startups.",
  },
];

const education = [
  {
    school: "Hyper Island",
    program: "Digital Media Creative",
    location: "Stockholm",
    year: "2016–2018",
  },
];

const clients = [
  "Uber",
  "Apple",
  "Sony Music",
  "Electrolux",
  "Philips",
  "Adobe",
  "Gjensidige",
  "NAV",
  "Norwegian Police",
  "Nordic Choice Hotels",
  "Norsk Tipping",
  "Swedbank",
  "Coop",
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
      <FadeIn>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          About
        </h1>
        <p className="mt-6 font-mono text-sm leading-relaxed text-brand-muted">
          Product designer with over a decade of experience in digital design.
          I specialize in building MVPs, design systems, and applying behavioral
          design principles to product development. I&rsquo;ve worked with
          clients ranging from global brands to early-stage startups.
        </p>
        <p className="mt-4 font-mono text-sm leading-relaxed text-brand-muted">
          I lead Friends of Figma Norway and contribute to UX Norge. My
          background spans graphic design, photography and videography, which
          gives me a broad perspective on digital product work.
        </p>
        <p className="mt-4 font-mono text-sm leading-relaxed text-brand-muted">
          Outside of work, I cycle long distances and travel with a camera.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-14">
          <h2 className="font-mono text-sm text-brand-muted">Selected clients</h2>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {clients.map((client) => (
              <span
                key={client}
                className="font-heading font-bold text-sm"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-14">
          <h2 className="font-mono text-sm text-brand-muted">Experience</h2>
          <ul className="mt-6 space-y-5">
            {career.map((role) => (
              <li key={role.company}>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-bold">{role.company}</span>
                    <span className="font-mono text-sm text-brand-muted">
                      · {role.role}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-brand-muted shrink-0">
                    {role.year}
                  </span>
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

      <FadeIn delay={0.2}>
        <div className="mt-14">
          <h2 className="font-mono text-sm text-brand-muted">Education</h2>
          <ul className="mt-6 space-y-4">
            {education.map((edu) => (
              <li key={edu.school} className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-bold">{edu.school}</span>
                  <span className="font-mono text-sm text-brand-muted">
                    · {edu.program}, {edu.location}
                  </span>
                </div>
                <span className="font-mono text-sm text-brand-muted shrink-0">
                  {edu.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  );
}
