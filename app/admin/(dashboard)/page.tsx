import Link from "next/link";
import { getProjects, getWebsiteTypes } from "@/lib/db/read";
import { listInquiries } from "@/lib/db/inquiries";

/**
 * Admin overview (Task 13.1). Quick counts + entry points.
 */
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [projectsRes, typesRes, inquiriesRes] = await Promise.all([
    getProjects(),
    getWebsiteTypes(),
    listInquiries(),
  ]);

  const cards = [
    {
      label: "Projects",
      count: projectsRes.ok ? projectsRes.value.length : "—",
      href: "/admin/projects",
    },
    {
      label: "Website Types",
      count: typesRes.ok ? typesRes.value.length : "—",
      href: "/admin/website-types",
    },
    {
      label: "Inquiries",
      count: inquiriesRes.ok ? inquiriesRes.value.length : "—",
      href: "/admin/inquiries",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Overview</h1>
      <p className="mt-2 text-muted">
        Manage your portfolio content and review inquiries.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-paper p-6 transition-colors duration-micro hover:bg-paper-soft"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-serif text-4xl text-ink">{card.count}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/projects/new"
          className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
        >
          + Add a project
        </Link>
        <Link
          href="/admin/site-content"
          className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
        >
          Edit site content
        </Link>
      </div>
    </div>
  );
}
