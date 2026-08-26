"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/website-types", label: "Website Types" },
  { href: "/admin/site-content", label: "Site Content" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

/**
 * Admin sidebar navigation (Task 13.1).
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex h-full flex-col justify-between">
      <div>
        <p className="px-4 font-serif text-xl tracking-tight text-ink">
          Admin
        </p>
        <ul className="mt-8 space-y-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block px-4 py-2 text-sm transition-colors duration-micro ${
                    active
                      ? "border-l-2 border-ink font-medium text-ink"
                      : "border-l-2 border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <form action={signOut} className="px-4 pb-2">
        <button
          type="submit"
          className="text-sm text-muted transition-colors duration-micro hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
