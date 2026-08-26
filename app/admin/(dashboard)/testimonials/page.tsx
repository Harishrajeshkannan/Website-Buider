import Link from "next/link";
import { getProjects } from "@/lib/db/read";

/**
 * Testimonials overview (Task 13.5).
 * Testimonials belong to a project (one-to-one), so they're edited on the
 * project form. This page lists which projects have a testimonial and links
 * to edit each one.
 */
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const result = await getProjects();
  const projects = result.ok ? result.value : [];

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">
        Testimonials
      </h1>
      <p className="mt-2 text-muted">
        Testimonials are attached to a project. Edit a project to add or change
        its testimonial.
      </p>

      {!result.ok ? (
        <p role="alert" className="mt-10 text-muted">
          Projects could not be loaded. Please refresh.
        </p>
      ) : projects.length === 0 ? (
        <p className="mt-10 text-muted">
          No projects yet. Add a project first, then attach a testimonial.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div>
                <p className="font-serif text-lg text-ink">
                  {project.clientName}
                </p>
                {project.testimonial ? (
                  <p className="mt-1 max-w-xl text-sm text-muted">
                    &ldquo;{project.testimonial.quote}&rdquo; —{" "}
                    {project.testimonial.authorName}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted">No testimonial yet.</p>
                )}
              </div>
              <Link
                href={`/admin/projects/${project.id}`}
                className="shrink-0 text-sm text-ink transition-opacity duration-micro hover:opacity-60"
              >
                {project.testimonial ? "Edit" : "Add"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
