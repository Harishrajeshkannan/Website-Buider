/**
 * Editorial footer (Task 9.1).
 */
export function SiteFooter({
  ownerName,
  contactEmail,
}: {
  ownerName: string;
  contactEmail: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60 bg-paper">
      <div className="mx-auto flex max-w-editorial flex-col gap-6 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-serif text-2xl tracking-tight">{ownerName}</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Premium websites for businesses that care about the details.
          </p>
        </div>
        <div className="text-sm text-muted">
          <div className="flex flex-col gap-1">
            <a
              href={`mailto:${contactEmail}`}
              className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
            >
              {contactEmail}
            </a>
            <a
              href="tel:+919080825690"
              className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
            >
              +91 9080825690
            </a>
          </div>
          <p className="mt-4">
            &copy; {year} {ownerName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
