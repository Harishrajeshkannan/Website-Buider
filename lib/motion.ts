import type { Variants, Transition } from "framer-motion";

/**
 * Motion configuration layer (Task 8).
 * Requirements: 17.1 (entrance on 25% intersection), 17.2 (<=300ms micro),
 * 17.3 (reduced-motion -> final state), 17.4 (<=600ms entrance).
 *
 * Durations are exported as numbers so they can be property-tested against the
 * timing budgets (Properties 31, 32).
 */

export const ENTRANCE_DURATION_S = 0.5; // 500ms, within the 600ms budget (Req 17.4)
export const MICRO_DURATION_S = 0.22; // 220ms, within the 300ms budget (Req 17.2)

/** Fraction of a section that must be visible before the entrance fires (Req 17.1). */
export const VIEWPORT_AMOUNT = 0.25;

export const entranceTransition: Transition = {
  duration: ENTRANCE_DURATION_S,
  ease: [0.22, 1, 0.36, 1],
};

export const microTransition: Transition = {
  duration: MICRO_DURATION_S,
  ease: "easeOut",
};

/** Section entrance: fade + subtle rise. */
export const entranceVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: entranceTransition },
};

/** Instant/final-state variants for reduced-motion (Req 17.3, Property 32). */
export const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

/**
 * Resolves the variants to use given a reduced-motion preference. When reduced,
 * transitions are disabled and content is shown in its final state
 * (Property 32).
 */
export function resolveVariants(prefersReducedMotion: boolean): Variants {
  return prefersReducedMotion ? reducedVariants : entranceVariants;
}

/**
 * Resolves a transition given reduced-motion. When reduced, duration is 0
 * (instant) so the control lands in its final state without animating.
 */
export function resolveTransition(
  base: Transition,
  prefersReducedMotion: boolean,
): Transition {
  return prefersReducedMotion ? { duration: 0 } : base;
}
