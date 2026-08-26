import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/app/actions/projects";

/**
 * Create project page (Task 13.2).
 */
export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-sm text-muted transition-colors duration-micro hover:text-ink"
      >
        &larr; Projects
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink">
        Add a project
      </h1>
      <div className="mt-10">
        <ProjectForm action={createProjectAction} submitLabel="Create project" />
      </div>
    </div>
  );
}
