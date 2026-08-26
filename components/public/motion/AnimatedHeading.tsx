"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Word-by-word heading reveal. Each word rises and fades in with a small
 * stagger, giving an editorial "typeset" feel. Respects reduced-motion by
 * rendering the final state instantly (Req 17.3).
 */
export function AnimatedHeading({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.55,
                delay: delay + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
