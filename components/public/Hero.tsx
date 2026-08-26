"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeading } from "./motion/AnimatedHeading";
import { MagneticButton } from "./motion/MagneticButton";

/**
 * Hero section (Task 9.2 + motion pass).
 * Requirements: 7.1 (name/tagline/service), 7.2 (CTA to contact), 17.x motion.
 *
 * Motion: eyebrow + word-by-word headline reveal, staggered supporting copy,
 * a magnetic CTA, and a subtle animated scroll cue. Reduced-motion safe.
 */
export function Hero({
  ownerName,
  tagline,
  serviceStatement,
}: {
  ownerName: string;
  tagline: string;
  serviceStatement: string;
}) {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative mx-auto flex min-h-[88vh] max-w-editorial flex-col justify-center px-6 pb-20 pt-16 md:px-10 md:pb-28">
      <motion.p
        {...fadeUp(0.05)}
        className="mb-8 text-sm uppercase tracking-[0.25em] text-muted"
      >
        {ownerName}
      </motion.p>

      <AnimatedHeading
        as="h1"
        text={tagline}
        delay={0.15}
        className="max-w-5xl font-serif text-5xl leading-[1.03] tracking-tight text-ink md:text-7xl lg:text-[5.5rem]"
      />

      <motion.p
        {...fadeUp(0.5)}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
      >
        {serviceStatement}
      </motion.p>

      <motion.div {...fadeUp(0.65)} className="mt-12">
        <MagneticButton
          href="#contact"
          className="group inline-flex items-center gap-3 text-lg text-ink"
        >
          <span className="link-underline pb-1">Start a project</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-micro group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </MagneticButton>
      </motion.div>

      {/* Animated scroll cue */}
      {!prefersReduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-6 hidden items-center gap-3 md:flex md:left-10"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Scroll
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-ink"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}
    </section>
  );
}
