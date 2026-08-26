import { getWebsiteTypes } from "@/lib/db/read";
import { WebsiteTypeManager } from "@/components/admin/WebsiteTypeManager";

/**
 * Website types admin page (Task 13.5).
 */
export const dynamic = "force-dynamic";

export default async function AdminWebsiteTypesPage() {
  const result = await getWebsiteTypes();
  const types = result.ok ? result.value : [];

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">
        Website Types
      </h1>
      <p className="mt-2 text-muted">
        The kinds of websites you build, shown in the &ldquo;What I build&rdquo;
        section.
      </p>
      {!result.ok && (
        <p role="alert" className="mt-6 text-sm text-ink">
          Existing types could not be loaded, but you can still add new ones.
        </p>
      )}
      <div className="mt-10">
        <WebsiteTypeManager types={types} />
      </div>
    </div>
  );
}
