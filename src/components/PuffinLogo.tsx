import Link from "next/link";

export function PuffinLogo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Home" className={className}>
      {/* Placeholder — replace with SVG from Figma export */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified puffin silhouette */}
        <circle cx="42" cy="30" r="22" />
        <ellipse cx="45" cy="65" rx="28" ry="30" />
        <ellipse cx="42" cy="28" rx="8" ry="6" fill="var(--brand-bg)" />
        <circle cx="38" cy="25" r="3" />
        <path d="M55 30 L75 25 L70 35 Z" />
        <ellipse cx="30" cy="85" rx="8" ry="5" />
        <ellipse cx="55" cy="85" rx="8" ry="5" />
      </svg>
    </Link>
  );
}
