"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ranges = [
  { value: "short_term", label: "4 weeks" },
  { value: "medium_term", label: "6 months" },
  { value: "long_term", label: "All time" },
] as const;

export function TimeRangeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "medium_term";

  function setRange(range: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2">
      {ranges.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setRange(value)}
          className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
            current === value
              ? "border-brand-dark bg-brand-dark text-brand"
              : "border-brand-dark/20 text-brand-muted hover:border-brand-dark/40"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
