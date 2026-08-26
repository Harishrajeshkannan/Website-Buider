"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Slow, continuous marquee of client names / industries. Adds editorial rhythm
 * between sections. Under reduced-motion it renders as a static, wrapped row.
 *
 * Uses a CSS keyframe animation (defined in globals.css) so it stays smooth and
 * cheap. The content is duplicated so the loop is seamless.
 */
export function Marquee({ items }: { items: string[] }) {
  const prefersReduced = useReducedMotion();

  if (items.length === 0) return null;

  if (prefersReduced) {
    return (
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 px-6 py-8">
        {items.map((item, i) => (
          <span key={i} className="text-sm uppercase tracking-[0.2em] text-muted">
            {item}
          </span>
        ))}
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="group relative flex overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            <span className="text-sm uppercase tracking-[0.2em] text-muted">
              {item}
            </span>
            <span className="text-line">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
