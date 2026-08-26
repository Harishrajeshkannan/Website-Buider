"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Cursor-follow spotlight glow (reference: brittanychiang.com). A soft radial
 * highlight that tracks the pointer, adding depth to the dark background.
 * Disabled under reduced-motion and on touch (no pointer).
 */
export function Spotlight() {
  const prefersReduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (prefersReduced) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(120,120,120,0.06), transparent 40%)`,
      }}
    />
  );
}
