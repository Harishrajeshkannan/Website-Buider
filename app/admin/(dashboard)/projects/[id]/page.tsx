import Link from "next/link";
import { notFound } from "next/navigation";
import { anonServerClient } from "@/lib/db/clients";
import { mapProject } from "@/lib/db/mappers";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProjectAction, type ProjectFormState } from "@/app/actions/projects";

/**
 * Edit project page (Task 13.2). Loads the project by id and binds the update
 * action to that id.
 */
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await anonServerClient();
  const { data } = await supabase
    .from("projects")
    .select("*, testimonials(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const project = mapProject(data);

  // Bind the project id to the update action (server action).
  async function boundUpdate(
    prev: ProjectFormState,
    formData: FormData,
  ): Promise<ProjectFormState> {
    "use server";
    return updateProjectAction(id, prev, formData);
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-sm text-muted transition-colors duration-micro hover:text-ink"
      >
        &larr; Projects
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink">
        Edit {project.clientName}
      </h1>
      <div className="mt-10">
        <ProjectForm
          action={boundUpdate}
          project={project}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
