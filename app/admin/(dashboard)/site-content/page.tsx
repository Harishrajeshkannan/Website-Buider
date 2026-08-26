import { getSiteContent } from "@/lib/db/read";
import { SiteContentForm } from "@/components/admin/SiteContentForm";

/**
 * Site content admin page (Task 13.5).
 */
export const dynamic = "force-dynamic";

export default async function AdminSiteContentPage() {
  const result = await getSiteContent();
  const content = result.ok ? result.value : null;

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">
        Site Content
      </h1>
      <p className="mt-2 text-muted">
        Hero, about, process, and contact details for the public site.
      </p>
      {!result.ok && (
        <p role="alert" className="mt-6 text-sm text-ink">
          Current content could not be loaded. Saving will create it fresh.
        </p>
      )}
      <div className="mt-10">
        <SiteContentForm content={content} />
      </div>
    </div>
  );
}
