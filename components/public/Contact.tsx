import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";

/**
 * Contact section shell + final CTA (Task 9.8).
 * Requirements: 15.1 (final CTA statement), 15.2 (form).
 */
export function Contact({ contactEmail }: { contactEmail: string }) {
  return (
    <section id="contact" className="mx-auto max-w-editorial px-6 py-20 md:px-10 md:py-32">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <Reveal as="div" className="md:col-span-6">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">
            Contact
          </p>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Let&apos;s build something worth visiting.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Have a project in mind? Tell me a little about it and I&apos;ll be in
            touch. Prefer email?{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60"
            >
              {contactEmail}
            </a>
          </p>
        </Reveal>
        <div className="md:col-span-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
