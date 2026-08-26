import Link from "next/link";

/**
 * Minimal editorial navigation (Task 9.1).
 * Keyboard-operable links with visible focus (Req 18.2, 18.3).
 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-paper/80 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-editorial items-center justify-between px-6 py-5 md:px-10"
      >
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-ink"
        >
          My Portfolio
        </Link>
        <ul className="flex items-center gap-6 text-sm text-muted md:gap-10">
          <li className="hidden md:block">
            <a href="/#work" className="transition-colors duration-micro hover:text-ink">
              Work
            </a>
          </li>
          <li className="hidden md:block">
            <a href="/#services" className="transition-colors duration-micro hover:text-ink">
              Services
            </a>
          </li>
          <li className="hidden md:block">
            <a href="/#about" className="transition-colors duration-micro hover:text-ink">
              About
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              className="inline-flex items-center border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
