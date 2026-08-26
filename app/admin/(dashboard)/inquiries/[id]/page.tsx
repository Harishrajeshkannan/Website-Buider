import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquiry } from "@/lib/db/inquiries";

/**
 * Inquiry detail (Task 13.7).
 * Requirements: 6.2 (show name/email/message/timestamp for one inquiry).
 */
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getInquiry(id);

  if (!result.ok) {
    return (
      <div>
        <Link
          href="/admin/inquiries"
          className="text-sm text-muted transition-colors duration-micro hover:text-ink"
        >
          &larr; Inquiries
        </Link>
        <p role="alert" className="mt-10 text-muted">
          This inquiry could not be loaded right now. Please refresh.
        </p>
      </div>
    );
  }

  if (result.value === null) notFound();
  const inquiry = result.value;

  return (
    <div>
      <Link
        href="/admin/inquiries"
        className="text-sm text-muted transition-colors duration-micro hover:text-ink"
      >
        &larr; Inquiries
      </Link>

      {/* Record card — customer inquiry details */}
      <div className="mt-6 overflow-hidden rounded-sm border border-line bg-paper">
        {/* Card header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-paper-soft px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              New inquiry
            </p>
            <h1 className="mt-1 font-serif text-3xl tracking-tight text-ink">
              {inquiry.name}
            </h1>
          </div>
          <time
            dateTime={inquiry.createdAt}
            className="text-sm text-muted"
          >
            {formatDate(inquiry.createdAt)}
          </time>
        </div>

        {/* Contact fields as a labelled grid */}
        <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          <div className="px-6 py-5">
            <dt className="text-xs uppercase tracking-[0.15em] text-muted">
              Email
            </dt>
            <dd className="mt-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="link-underline text-ink"
              >
                {inquiry.email}
              </a>
            </dd>
          </div>
          <div className="px-6 py-5">
            <dt className="text-xs uppercase tracking-[0.15em] text-muted">
              Phone
            </dt>
            <dd className="mt-2">
              {inquiry.phone ? (
                <a
                  href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
                  className="link-underline text-ink"
                >
                  {inquiry.phone}
                </a>
              ) : (
                <span className="text-muted">Not provided</span>
              )}
            </dd>
          </div>
        </dl>

        {/* Message */}
        <div className="border-t border-line px-6 py-5">
          <dt className="text-xs uppercase tracking-[0.15em] text-muted">
            Message
          </dt>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">
            {inquiry.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 border-t border-line bg-paper-soft px-6 py-5">
          <a
            href={`mailto:${inquiry.email}?subject=Re: your inquiry`}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-sm text-paper transition-opacity duration-micro hover:opacity-80"
          >
            Reply by email &rarr;
          </a>
          {inquiry.phone && (
            <a
              href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 border border-ink px-4 py-2 text-sm text-ink transition-colors duration-micro hover:bg-paper"
            >
              Call customer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
