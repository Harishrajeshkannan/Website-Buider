"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/schema/project";
import {
  deriveFilterOptions,
  filterProjects,
  ALL_FILTER,
} from "@/lib/content-helpers";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { AnimatedHeading } from "./motion/AnimatedHeading";

/**
 * Selected Work section with client-side Portfolio Filter (Task 9.6).
 * Requirements: 8.1, 8.7 (empty state), 10.1-10.5 (filtering).
 *
 * The server passes the full project list; filtering is in-memory so there is
 * no refetch. "All" is selected by default and selection is single-select.
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string>(ALL_FILTER);

  const options = useMemo(() => deriveFilterOptions(projects), [projects]);
  const visible = useMemo(
    () => filterProjects(projects, selected),
    [projects, selected],
  );

  return (
    <section id="work" className="mx-auto max-w-editorial px-6 py-20 md:px-10 md:py-28">
      <Reveal>
        <div className="flex flex-col gap-8 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">
              Selected Work
            </p>
            <AnimatedHeading
              text="Websites built to perform"
              className="mt-3 font-serif text-4xl tracking-tight text-ink md:text-5xl"
            />
          </div>

          {/* Portfolio filter (Req 10.1, 10.2, 10.5) */}
          {options.length > 1 && (
            <div
              role="group"
              aria-label="Filter projects by industry"
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
            >
              {options.map((option) => {
                const active = option === selected;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(option)}
                    className={`relative pb-1 transition-colors duration-micro ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {option}
                    {active && (
                      <motion.span
                        layoutId="filter-underline"
                        className="absolute inset-x-0 bottom-0 h-px bg-ink"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>

      {projects.length === 0 ? (
        // Empty state (Req 8.7)
        <p className="mt-16 text-center text-lg text-muted">
          No work is currently available. Check back soon.
        </p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-20 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  delay: (i % 2) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
