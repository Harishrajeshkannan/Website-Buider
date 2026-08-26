import { Reveal } from "./Reveal";

/**
 * About section (Task 9.7).
 * Requirements: 14.1-14.3. Text is passed in already resolved (placeholder-safe).
 */
export function About({
  ownerName,
  aboutText,
}: {
  ownerName: string;
  aboutText: string;
}) {
  return (
    <section
      id="about"
      className="border-y border-line bg-paper-soft"
    >
      <div className="mx-auto grid max-w-editorial grid-cols-1 gap-12 px-6 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <Reveal as="div" className="md:col-span-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">
            About
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink">
            {ownerName}
          </h2>
        </Reveal>
        <Reveal as="div" className="md:col-span-8">
          <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
            {aboutText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
