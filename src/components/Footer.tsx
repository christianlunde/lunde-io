import { NowPlaying } from "./NowPlaying";

export function Footer() {
  return (
    <footer className="px-6 py-8 sm:px-12">
      <div className="mb-4">
        <NowPlaying />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-mono text-sm text-brand-muted">
        <p>&copy; {new Date().getFullYear()} Christian Lunde</p>
        <nav className="flex gap-6">
          <a
            href="https://www.instagram.com/christianlunde/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-dark transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/chrlunde/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-dark transition-colors"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
