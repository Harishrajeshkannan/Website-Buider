"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Rotating word cycler (reference: metajive.com animated hero verbs).
 * Cycles through a list of words with a vertical slide/fade. Under reduced
 * motion it shows the first word statically.
 */
export function RotatingWords({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced || words.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [prefersReduced, words.length, interval]);

  if (prefersReduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}
    >
      {/* Reserve width using the longest word so layout doesn't jump */}
      <span className="invisible block" aria-hidden="true">
        {words.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
