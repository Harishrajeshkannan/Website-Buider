import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/db/read";
import { staticAnonClient } from "@/lib/db/clients";
import { selectDescription } from "@/lib/content-helpers";
import { Reveal } from "@/components/public/Reveal";

/**
 * Project detail / case-study page (Task 10.1).
 * Requirements: 9.1 (one page per project), 9.2 (description), 9.3 (testimonial),
 * 9.4 (404 on unknown), 9.5 (back nav), 13.2/13.3 (testimonial display).
 */

export const revalidate = 5;

// One statically-generated page per project slug (Req 9.1).
// Runs at build time (no request scope), so it uses the cookie-free client.
export async function generateStaticParams() {
  try {
    const supabase = staticAnonClient();
    const { data, error } = await supabase.from("projects").select("slug");
    if (error || !data) return [];
    return data.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  // Unknown slug -> 404 (Req 9.4)
  if (!result.ok || result.value === null) {
    notFound();
  }

  const project = result.value;
  const description = selectDescription(project);

  return (
    <article className="mx-auto max-w-editorial px-6 py-16 md:px-10 md:py-24">
      {/* Back to work (Req 9.5) */}
      <Reveal>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-micro hover:text-ink"
        >
          <span aria-hidden="true">&larr;</span> Back to work
        </Link>
      </Reveal>

      <Reveal>
        <header className="mt-10 border-b border-line pb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">
            {project.industry}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
            {project.clientName}
          </h1>
          <div className="mt-8">
            <a
              href={project.liveSiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
            >
              Visit live site <span aria-hidden="true">&nearr;</span>
            </a>
          </div>
        </header>
      </Reveal>

      {/* Dominant hero image */}
      <Reveal>
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-paper-soft">
          <Image
            src={project.previewImageUrl}
            alt={project.previewImageAlt}
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </Reveal>

      {/* Description (Req 9.2) */}
      <Reveal>
        <div className="mx-auto mt-16 max-w-3xl">
          <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
            {description}
          </p>
        </div>
      </Reveal>

      {/* Testimonial when associated (Req 9.3, 13.2) */}
      {project.testimonial && (
        <Reveal>
          <figure className="mx-auto mt-20 max-w-3xl border-t border-ink pt-10">
            <blockquote className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              {project.testimonial.authorName}
              {project.testimonial.role ? `, ${project.testimonial.role}` : ""}
              <span className="mx-2">&middot;</span>
              {project.clientName}
            </figcaption>
          </figure>
        </Reveal>
      )}

      <Reveal>
        <div className="mx-auto mt-20 max-w-3xl border-t border-line pt-10">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 text-lg text-ink"
          >
            <span className="border-b border-ink pb-1 transition-opacity duration-micro group-hover:opacity-60">
              Start a project like this
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-micro group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
