"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { Project } from "@/lib/schema/project";
import type { WebsiteType } from "@/lib/schema/content";
import type { ProcessStage } from "@/lib/content-helpers";
import { WorkList } from "./WorkList";
import { ContactForm } from "./ContactForm";
import { FeaturedBanner } from "./FeaturedBanner";

/**
 * Scrolling right column for the split layout (reference: brittanychiang.com).
 * Composes the content sections densely so the page reads as one continuous,
 * well-filled scroll rather than airy full-width bands.
 */

function SectionShell({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <section id={id} className="scroll-mt-24 py-16 lg:py-24">
      <h2 className="mb-8 text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </h2>
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function RightColumn({
  projects,
  websiteTypes,
  stages,
  aboutText,
}: {
  projects: Project[];
  websiteTypes: WebsiteType[];
  stages: ProcessStage[];
  aboutText: string;
}) {
  return (
    <div className="lg:py-24">
      {/* About — leads the column on mobile-to-desktop for context */}
      <SectionShell id="about" label="About">
        <p className="max-w-2xl text-lg leading-relaxed text-ink/80">
          {aboutText}
        </p>
      </SectionShell>

      {/* Featured full-bleed visual (ref: metajive) */}
      <FeaturedBanner
        src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&q=80"
        alt="A designer's workspace with a laptop showing a website design"
        caption="Design and engineering, working as one."
      />

      {/* Work */}
      <WorkList projects={projects} />

      {/* Services */}
      {websiteTypes.length > 0 && (
        <SectionShell id="services" label="What I Build">
          <ul className="divide-y divide-line border-y border-line">
            {websiteTypes.map((type, i) => (
              <li
                key={type.id}
                className="group/svc flex gap-5 py-5 transition-colors duration-300"
              >
                <span className="font-serif text-lg text-line transition-colors duration-300 group-hover/svc:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl tracking-tight text-ink">
                    {type.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {type.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      {/* Process */}
      <SectionShell id="process" label="Process">
        <ol className="space-y-6">
          {stages.map((stage, i) => (
            <li key={stage.name} className="flex gap-5">
              <span className="mt-1 font-serif text-lg text-line">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-xl tracking-tight text-ink">
                  {stage.name}
                </h3>
                {stage.description && (
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                    {stage.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* Contact */}
      <SectionShell id="contact" label="Contact">
        <p className="max-w-xl font-serif text-2xl leading-snug text-ink">
          Let&apos;s build something worth visiting.
        </p>
        <p className="mt-4 max-w-md text-muted">
          Have a project in mind? Tell me a little about it and I&apos;ll be in
          touch.
        </p>
        <div className="mt-8 max-w-xl border-l-2 border-ink pl-6">
          <ContactForm />
        </div>
      </SectionShell>
    </div>
  );
}
