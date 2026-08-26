"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Thin scroll-progress bar fixed at the top of the viewport. A quiet, premium
 * signal of page position. Hidden entirely under reduced-motion.
 */
export function ScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-ink"
    />
  );
}
