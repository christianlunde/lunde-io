import Link from "next/link";
import { PlaceCard } from "@/components/PlaceCard";
import { FadeIn } from "@/components/FadeIn";

const mockPlaces = [
  {
    _key: "1",
    title: "Pastéis de Belém",
    category: "Café",
    description:
      "The original pastel de nata since 1837. Eat them warm, dusted with cinnamon and powdered sugar, standing at the counter. Queue is long but moves fast — worth every minute.",
    address: "Rua de Belém 84–92, Lisboa",
    googleMapsUrl: "https://maps.google.com",
    publishedAt: "2025-03-01",
  },
  {
    _key: "2",
    title: "Time Out Market",
    category: "Restaurant",
    description:
      "Not a tourist trap — it's genuinely the best food hall in Europe. Grab a seat by the bar and work your way through dishes from the city's top chefs. Go on a weekday.",
    address: "Av. 24 de Julho 49, Lisboa",
    googleMapsUrl: "https://maps.google.com",
    publishedAt: "2025-03-01",
  },
  {
    _key: "3",
    title: "Tasca do Chico",
    category: "Bar",
    description:
      "Tiny fado house, 25 people max. No stage — the performers stand between the tables and sing straight to you. Book weeks in advance. Bring wine money.",
    address: "Rua do Diário de Notícias 39, Lisboa",
    googleMapsUrl: "https://maps.google.com",
    publishedAt: "2025-03-01",
  },
  {
    _key: "4",
    title: "Livraria Bertrand",
    category: "Shop",
    description:
      "The world's oldest operating bookshop, open since 1732. Even if you don't read Portuguese, the building alone justifies the stop. Postcards make great souvenirs.",
    address: "Rua Garrett 73, Lisboa",
    googleMapsUrl: "https://maps.google.com",
    publishedAt: "2025-03-01",
  },
  {
    _key: "5",
    title: "Miradouro da Graça",
    category: "Viewpoint",
    description:
      "Better than Miradouro da Sé and far fewer tourists. Come at golden hour with a bottle of Sagres and watch the light turn the river copper. Tram 28 drops you nearby.",
    address: "Largo da Graça, Lisboa",
    googleMapsUrl: "https://maps.google.com",
    publishedAt: "2025-03-01",
  },
];

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-16 sm:px-12">
      <FadeIn>
        <Link
          href="/places"
          className="font-mono text-sm text-brand-muted hover:text-brand-dark transition-colors"
        >
          &larr; Places
        </Link>
        <header className="mt-8">
          <p className="font-mono text-sm text-brand-muted">Portugal</p>
          <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Lisbon
          </h1>
          <p className="mt-3 font-mono text-sm text-brand-muted leading-relaxed">
            Five days in March. The city that makes everywhere else feel like
            it&apos;s trying too hard.
          </p>
        </header>
      </FadeIn>

      <div className="mt-16 space-y-16">
        {mockPlaces.map((place, i) => (
          <FadeIn key={place._key} delay={0.05 * i}>
            <PlaceCard
              index={i}
              title={place.title}
              category={place.category}
              description={place.description}
              address={place.address}
              googleMapsUrl={place.googleMapsUrl}
              publishedAt={place.publishedAt}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
