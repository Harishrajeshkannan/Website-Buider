import Link from "next/link";

/**
 * 404 for unknown project slugs (Task 10.2, Req 9.4).
 */
export default function ProjectNotFound() {
  return (
    <div className="mx-auto flex max-w-editorial flex-col items-start px-6 py-32 md:px-10">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink md:text-6xl">
        That project doesn&apos;t exist.
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        The case study you&apos;re looking for may have moved or been removed.
      </p>
      <Link
        href="/#work"
        className="mt-10 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
      >
        <span aria-hidden="true">&larr;</span> Back to all work
      </Link>
    </div>
  );
}
