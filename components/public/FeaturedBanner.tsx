"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ClipReveal } from "./motion/ClipReveal";

/**
 * Large featured visual with a clip-reveal + parallax (reference: metajive.com
 * full-bleed imagery). Adds a bold image moment between text sections so the
 * page isn't all type. Reduced-motion shows a static image.
 */
export function FeaturedBanner({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-8%", "8%"],
  );

  return (
    <div className="py-8 lg:py-12">
      <ClipReveal className="relative aspect-[16/9] w-full overflow-hidden bg-paper-soft">
        <div ref={ref} className="absolute inset-0">
          <motion.div style={{ y }} className="absolute inset-[-8%]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          {caption && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/40 to-transparent p-6">
              <p className="max-w-md font-serif text-2xl leading-snug text-paper md:text-3xl">
                {caption}
              </p>
            </div>
          )}
        </div>
      </ClipReveal>
    </div>
  );
}
