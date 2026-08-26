"use client";

import { useActionState } from "react";
import type { SiteContent } from "@/lib/schema/content";
import {
  saveSiteContentAction,
  type ContentFormState,
} from "@/app/actions/content";

const initial: ContentFormState = { status: "idle" };

function Row({
  label,
  name,
  defaultValue,
  errors,
  as = "input",
  maxLength,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  errors?: string[];
  as?: "input" | "textarea";
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-muted">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          maxLength={maxLength}
          rows={3}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          defaultValue={defaultValue ?? ""}
          maxLength={maxLength}
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {errors?.map((e) => (
        <p key={e} className="mt-1 text-sm text-ink">
          {e}
        </p>
      ))}
    </div>
  );
}

/**
 * Site content editor (Task 13.5).
 * Requirements: 5.2, 5.6, plus 7/12/14 content fields. Empty fields fall back
 * to placeholders on the public site.
 */
export function SiteContentForm({ content }: { content: SiteContent | null }) {
  const [state, formAction, pending] = useActionState(
    saveSiteContentAction,
    initial,
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-10">
      {state.formError && (
        <p role="alert" className="border border-ink bg-paper px-4 py-3 text-sm text-ink">
          {state.formError}
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="text-sm text-muted">
          Saved. Changes appear on the site within a few seconds.
        </p>
      )}

      <section className="space-y-6">
        <h2 className="font-serif text-xl text-ink">Identity</h2>
        <Row label="Owner / studio name" name="ownerName" defaultValue={content?.ownerName} errors={fe.ownerName} maxLength={100} hint="Leave blank to use the default placeholder." />
        <Row label="Tagline" name="tagline" defaultValue={content?.tagline} errors={fe.tagline} maxLength={160} />
        <Row label="Service statement" name="serviceStatement" defaultValue={content?.serviceStatement} errors={fe.serviceStatement} maxLength={300} as="textarea" />
        <Row label="Contact email" name="contactEmail" defaultValue={content?.contactEmail} errors={fe.contactEmail} maxLength={254} />
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-xl text-ink">About</h2>
        <Row label="About text" name="aboutText" defaultValue={content?.aboutText} errors={fe.aboutText} maxLength={4000} as="textarea" />
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-xl text-ink">Process</h2>
        <Row label="Strategy" name="processStrategy" defaultValue={content?.processStrategy} maxLength={600} as="textarea" />
        <Row label="Design" name="processDesign" defaultValue={content?.processDesign} maxLength={600} as="textarea" />
        <Row label="Development" name="processDevelopment" defaultValue={content?.processDevelopment} maxLength={600} as="textarea" />
        <Row label="Launch" name="processLaunch" defaultValue={content?.processLaunch} maxLength={600} as="textarea" />
      </section>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-3 border-b border-ink pb-1 text-lg text-ink transition-opacity duration-micro hover:opacity-60 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save site content"}
      </button>
    </form>
  );
}
