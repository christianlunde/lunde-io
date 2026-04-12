import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { PuffinLogo } from "./PuffinLogo";

export function Header() {
  return (
    <header className="px-6 py-5 sm:px-12 sm:py-6">
      <nav className="flex items-center justify-between">
        <PuffinLogo />
        <div className="flex items-center gap-6 sm:gap-8">
          <ul className="flex gap-6 text-sm font-mono sm:gap-8">
            <li>
              <Link
                href="/about"
                className="underline-offset-4 hover:underline transition-all"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/journal"
                className="underline-offset-4 hover:underline transition-all"
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                href="/music"
                className="underline-offset-4 hover:underline transition-all"
              >
                Music
              </Link>
            </li>
            <li>
              <Link
                href="/places"
                className="underline-offset-4 hover:underline transition-all"
              >
                Places
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
