"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: tracks which section is currently in view so the left-rail nav
 * can highlight it (reference: brittanychiang.com active-section highlight).
 */
export function useScrollSpy(ids: string[], offset = 0.4): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {
        rootMargin: `-${Math.round(offset * 100)}% 0px -${Math.round(
          (1 - offset) * 100,
        )}% 0px`,
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}
