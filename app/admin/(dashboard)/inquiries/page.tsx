import Link from "next/link";
import { listInquiries } from "@/lib/db/inquiries";

/**
 * Inquiry list (Task 13.7).
 * Requirements: 6.1 (most-recent-first with name/email/message/timestamp),
 * 6.3 (empty state), 6.4 (error state on DB unreachable).
 */
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminInquiriesPage() {
  const result = await listInquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Inquiries</h1>
      <p className="mt-2 text-muted">Messages submitted through the contact form.</p>

      {!result.ok ? (
        // Error state (Req 6.4)
        <p role="alert" className="mt-10 text-muted">
          Inquiries could not be loaded right now. Please refresh in a moment.
        </p>
      ) : result.value.length === 0 ? (
        // Empty state (Req 6.3)
        <p className="mt-10 text-muted">No inquiries have been received yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {result.value.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex items-start justify-between gap-4 py-4 transition-colors duration-micro hover:bg-paper-soft"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{inquiry.name}</p>
                  <p className="text-sm text-muted">
                    {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted">
                    {inquiry.message}
                  </p>
                </div>
                <time
                  dateTime={inquiry.createdAt}
                  className="shrink-0 text-xs text-muted"
                >
                  {formatDate(inquiry.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
