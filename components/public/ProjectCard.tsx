"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/lib/schema/project";

const FALLBACK_IMAGE = "/placeholder-project.svg";

/**
 * ProjectCard client island (Task 9.3 + motion pass).
 * Requirements: 8.1-8.6, 8.8, 18.1.
 *
 * Motion: gentle parallax on the preview image as it scrolls through the
 * viewport, an image zoom + dark reveal overlay on hover with a "View case
 * study" cue, and an index label. All reduced-motion safe.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [imgSrc, setImgSrc] = useState(project.previewImageUrl);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Subtle vertical parallax on the image (disabled when reduced).
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-6%", "6%"],
  );

  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        className="relative block overflow-hidden bg-paper-soft"
        aria-label={`View case study: ${project.clientName}`}
      >
        <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-[-6%]">
            <Image
              src={imgSrc}
              alt={project.previewImageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 90vw, 100vw"
              className="object-cover transition-transform duration-[500ms] ease-out group-hover:scale-[1.04]"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
          </motion.div>

          {/* Hover reveal overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-end bg-ink/0 p-6 opacity-0 transition-all duration-[400ms] ease-out group-hover:bg-ink/30 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 bg-paper px-4 py-2 text-sm text-ink">
              View case study <span aria-hidden="true">&rarr;</span>
            </span>
          </div>

          {index != null && (
            <span className="absolute left-5 top-5 font-serif text-sm text-paper mix-blend-difference">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <Link
              href={`/work/${project.slug}`}
              className="link-underline font-serif text-2xl tracking-tight text-ink"
            >
              {project.clientName}
            </Link>
            <span className="text-xs uppercase tracking-[0.15em] text-muted">
              {project.industry}
            </span>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            {project.shortDescription}
          </p>
        </div>
        <a
          href={project.liveSiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-1 shrink-0 whitespace-nowrap text-sm text-ink"
        >
          Visit site &nearr;
        </a>
      </div>
    </article>
  );
}
