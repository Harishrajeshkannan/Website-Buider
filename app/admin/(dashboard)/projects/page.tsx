import Link from "next/link";
import { getProjects } from "@/lib/db/read";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";

/**
 * Project list (Task 13.2). Table of projects with edit/delete.
 */
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const result = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl tracking-tight text-ink">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
        >
          + Add project
        </Link>
      </div>

      {!result.ok ? (
        <p role="alert" className="mt-10 text-muted">
          Projects could not be loaded. Please refresh.
        </p>
      ) : result.value.length === 0 ? (
        <p className="mt-10 text-muted">
          No projects yet. Add your first one to get started.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {result.value.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="font-serif text-lg text-ink">
                  {project.clientName}
                </p>
                <p className="text-sm text-muted">
                  {project.industry} · /{project.slug}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-sm text-ink transition-opacity duration-micro hover:opacity-60"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
