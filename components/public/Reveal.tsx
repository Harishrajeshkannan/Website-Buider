"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  entranceTransition,
  VIEWPORT_AMOUNT,
} from "@/lib/motion";

/**
 * Entrance-animation wrapper (Task 9.1).
 * Fades + rises content when >=25% enters the viewport (Req 17.1, 17.4).
 * Respects prefers-reduced-motion: renders final state instantly (Req 17.3).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as];

  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: VIEWPORT_AMOUNT }}
      transition={{ ...entranceTransition, delay }}
    >
      {children}
    </MotionTag>
  );
}
