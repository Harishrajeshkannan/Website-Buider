"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { ProcessStage } from "@/lib/content-helpers";
import { AnimatedHeading } from "./motion/AnimatedHeading";

/**
 * Process section (Task 9.7 + motion pass).
 * Requirements: 12.1 (four ordered stages), 12.2 (descriptions).
 *
 * Motion: a scroll-driven line grows across the four steps as they enter view,
 * and each step fades/rises in sequence. Reduced-motion renders the line full
 * and the steps static.
 */
export function Process({ stages }: { stages: ProcessStage[] }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="mx-auto max-w-editorial px-6 py-20 md:px-10 md:py-28">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-muted">
          How I work
        </p>
        <AnimatedHeading
          text="A clear path from idea to launch"
          className="mt-3 font-serif text-4xl tracking-tight text-ink md:text-5xl"
        />
      </div>

      <div ref={ref} className="relative mt-14 md:mt-20">
        {/* Progress line (horizontal on desktop) */}
        <div className="absolute left-0 right-0 top-0 hidden h-px bg-line md:block">
          <motion.div
            className="h-full origin-left bg-ink"
            style={{
              scaleX: prefersReduced ? 1 : lineScale,
            }}
          />
        </div>

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          {stages.map((stage, i) => (
            <motion.li
              key={stage.name}
              initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="md:pt-8"
            >
              <div className="border-t border-transparent pt-5 md:border-t-0 md:pt-0">
                <span className="font-serif text-3xl text-line">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-2xl tracking-tight text-ink">
                  {stage.name}
                </h3>
                {stage.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {stage.description}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
