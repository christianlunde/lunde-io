import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="px-6 py-5 sm:px-12 sm:py-6">
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-base font-bold tracking-tight sm:text-lg"
        >
          Christian Lunde
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <ul className="flex gap-6 text-sm font-mono sm:gap-8">
            <li>
              <Link
                href="/om"
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
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
