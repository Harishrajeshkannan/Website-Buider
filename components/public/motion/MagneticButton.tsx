"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Magnetic link: the element subtly follows the cursor within its bounds and
 * springs back on leave. A refined micro-interaction (Req 17.2) that signals
 * polish without being loud. Falls back to a plain anchor under reduced-motion.
 */
export function MagneticButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.25, y: y * 0.25 });
  }

  function reset() {
    setPos({ x: 0, y: 0 });
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.3 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
