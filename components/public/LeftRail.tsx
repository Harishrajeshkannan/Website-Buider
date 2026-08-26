"use client";

import { useScrollSpy } from "@/lib/use-scroll-spy";
import { MagneticButton } from "./motion/MagneticButton";
import { RotatingWords } from "./motion/RotatingWords";

// Order must match the DOM order of sections in RightColumn.tsx so the
// scroll-spy highlight tracks correctly.
const SECTIONS = [
  { id: "about", label: "About" },
  { id: "work", label: "Selected Work" },
  { id: "services", label: "What I Build" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

/**
 * Sticky left rail. Identity + scroll-spy nav + CTA all within the fixed
 * viewport so nothing scrolls off-screen.
 */
export function LeftRail({
  ownerName,
  tagline,
  serviceStatement,
}: {
  ownerName: string;
  tagline: string;
  serviceStatement: string;
}) {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));

  return (
    <div className="lg:sticky lg:top-0 lg:py-24">
      {/* Identity */}
      <h1 className="font-serif text-4xl tracking-tight text-ink md:text-5xl">
        {ownerName}
      </h1>

      <p className="mt-5 font-serif text-3xl leading-none tracking-tight text-ink md:text-4xl">
        Websites that{" "}
        <RotatingWords
          className="text-ink"
          words={["convert", "build trust", "stand out", "sell", "impress"]}
        />
      </p>

      <p className="mt-5 max-w-sm font-serif text-xl leading-snug text-ink/80">
        {tagline}
      </p>
      <p className="mt-4 max-w-sm leading-relaxed text-muted">
        {serviceStatement}
      </p>

      {/* Scroll-spy nav (desktop) */}
      <nav aria-label="Sections" className="mt-14 hidden lg:block">
        <ul className="space-y-4">
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-4"
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-16 bg-ink"
                        : "w-8 bg-line group-hover:w-16 group-hover:bg-ink"
                    }`}
                  />
                  <span
                    className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive
                        ? "text-ink"
                        : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CTA — directly below nav */}
      <div className="mt-8">
        <MagneticButton
          href="#contact"
          className="group inline-flex items-center gap-3 text-ink"
        >
          <span className="link-underline pb-1">Start a project</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-micro group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </MagneticButton>
      </div>
    </div>
  );
}
