import type { WebsiteType } from "@/lib/schema/content";
import { Reveal } from "./Reveal";
import { AnimatedHeading } from "./motion/AnimatedHeading";

/**
 * Website Types section (Task 9.7).
 * Requirements: 11.1 (name + description), 11.3 (empty-safe render).
 */
export function WebsiteTypes({ types }: { types: WebsiteType[] }) {
  if (types.length === 0) return null; // Req 11.3

  return (
    <section
      id="services"
      className="border-y border-line bg-paper-soft"
    >
      <div className="mx-auto max-w-editorial px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">
            What I build
          </p>
          <AnimatedHeading
            text="The kinds of websites I design and build"
            className="mt-3 max-w-3xl font-serif text-4xl tracking-tight text-ink md:text-5xl"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:mt-20 md:grid-cols-2">
          {types.map((type, i) => (
            <Reveal as="div" key={type.id} delay={(i % 2) * 0.06}>
              <div className="group/cell relative h-full overflow-hidden bg-paper p-8 md:p-12">
                <span className="font-serif text-xl text-muted transition-colors duration-300 group-hover/cell:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-2xl tracking-tight text-ink">
                  {type.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {type.description}
                </p>
                {/* Slide-in accent bar on hover */}
                <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-ink transition-transform duration-[400ms] ease-out group-hover/cell:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
