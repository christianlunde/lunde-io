export function Footer() {
  return (
    <footer className="px-8 py-8 sm:px-12">
      <p className="text-sm font-mono text-brand-muted">
        &copy; {new Date().getFullYear()} Christian Lunde
      </p>
    </footer>
  );
}
