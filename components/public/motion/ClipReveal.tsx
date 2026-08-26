"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Clip-path reveal (reference: metajive.com image reveals). The container
 * "wipes" into view from bottom to top as it enters the viewport.
 *
 * Important: this is a SINGLE element so it doesn't add wrappers between a
 * sized container and a `fill` image inside it. The `className` (which carries
 * the size, e.g. aspect ratio + relative) is applied directly here, so a
 * `next/image` with `fill` still measures against a properly-sized parent.
 *
 * Reduced-motion renders the content immediately with no clip.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
