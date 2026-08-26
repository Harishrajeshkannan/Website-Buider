"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/schema/project";

const FALLBACK_IMAGE = "/placeholder-project.svg";

/**
 * Dense project row (reference: brittanychiang.com projects list).
 * A compact two-column row — thumbnail + text — that highlights on hover by
 * lifting the active row and dimming the rest of the group. Much less empty
 * space than large stacked cards, while keeping the preview prominent.
 */
export function ProjectRow({ project }: { project: Project }) {
  const prefersReduced = useReducedMotion();
  const [imgSrc, setImgSrc] = useState(project.previewImageUrl);

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group/row relative grid grid-cols-1 gap-5 rounded-sm p-4 transition-colors duration-300 hover:bg-paper-soft sm:grid-cols-[200px_1fr] lg:group-hover/list:opacity-40 lg:hover:!opacity-100"
        aria-label={`View case study: ${project.clientName}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-paper-soft sm:aspect-[4/3]">
          <Image
            src={imgSrc}
            alt={project.previewImageAlt}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-500 ease-out group-hover/row:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>

        {/* Text */}
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-2xl tracking-tight text-ink">
              {project.clientName}
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform duration-micro group-hover/row:translate-x-1"
              >
                &rarr;
              </span>
            </h3>
            <span className="text-xs uppercase tracking-[0.15em] text-muted">
              {project.industry}
            </span>
          </div>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            {project.shortDescription}
          </p>
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              window.open(project.liveSiteLink, "_blank", "noopener,noreferrer");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.open(
                  project.liveSiteLink,
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            }}
            className="link-underline mt-3 inline-block text-sm text-ink"
          >
            Visit live site &nearr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
