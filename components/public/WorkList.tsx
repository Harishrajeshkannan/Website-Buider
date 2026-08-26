"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/schema/project";
import {
  deriveFilterOptions,
  filterProjects,
  ALL_FILTER,
} from "@/lib/content-helpers";
import { ProjectRow } from "./ProjectRow";

/**
 * Dense work list for the split layout (reference: brittanychiang.com).
 * Requirements: 8.1, 8.7, 10.1-10.5. Replaces the airy two-column card grid
 * with tight list rows to remove empty space, keeping the filter behavior.
 */
export function WorkList({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string>(ALL_FILTER);
  const options = useMemo(() => deriveFilterOptions(projects), [projects]);
  const visible = useMemo(
    () => filterProjects(projects, selected),
    [projects, selected],
  );

  return (
    <section id="work" className="scroll-mt-24 py-16 first:pt-0 lg:py-24">
      <div className="sticky top-0 z-20 -mx-4 mb-6 bg-paper/80 px-4 py-4 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted lg:sr-only">
          Selected Work
        </h2>
      </div>

      {options.length > 1 && (
        <div
          role="group"
          aria-label="Filter projects by industry"
          className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm"
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
                    layoutId="worklist-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-muted">No work is currently available. Check back soon.</p>
      ) : (
        <div className="group/list flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectRow project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
