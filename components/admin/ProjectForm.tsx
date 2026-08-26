"use client";

import { useActionState } from "react";
import type { Project } from "@/lib/schema/project";
import type { ProjectFormState } from "@/app/actions/projects";
import { ImageUpload } from "./ImageUpload";

/**
 * Shared create/edit project form (Task 13.2).
 * Requirements: 5.1, 5.6 (per-field validation messages + value retention).
 * Uncontrolled inputs preserve the admin's entries on a failed submit because
 * the same form re-renders with the returned error state.
 */

const initial: ProjectFormState = { status: "idle" };

function Field({
  label,
  name,
  defaultValue,
  errors,
  maxLength,
  required,
  as = "input",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  errors?: string[];
  maxLength?: number;
  required?: boolean;
  as?: "input" | "textarea";
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-muted">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          maxLength={maxLength}
          rows={4}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          defaultValue={defaultValue}
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

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (
    prev: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
  project?: Project;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {state.formError && (
        <p role="alert" className="border border-ink bg-paper px-4 py-3 text-sm text-ink">
          {state.formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          label="Client / business name"
          name="clientName"
          defaultValue={project?.clientName}
          errors={fe.clientName}
          maxLength={100}
          required
        />
        <Field
          label="Industry / category"
          name="industry"
          defaultValue={project?.industry}
          errors={fe.industry}
          maxLength={60}
          required
        />
      </div>

      <Field
        label="Slug (URL identifier)"
        name="slug"
        defaultValue={project?.slug}
        errors={fe.slug}
        maxLength={60}
        required
        hint="Lowercase letters, numbers, and hyphens only (e.g. northwind-coffee)."
      />

      <Field
        label="Short description"
        name="shortDescription"
        defaultValue={project?.shortDescription}
        errors={fe.shortDescription}
        maxLength={200}
        required
        as="textarea"
      />

      <Field
        label="Long description (case study body)"
        name="longDescription"
        defaultValue={project?.longDescription}
        errors={fe.longDescription}
        maxLength={2000}
        as="textarea"
      />

      <Field
        label="Live site URL"
        name="liveSiteLink"
        defaultValue={project?.liveSiteLink}
        errors={fe.liveSiteLink}
        required
        hint="Must start with http:// or https://"
      />

      <ImageUpload
        name="previewImageUrl"
        altName="previewImageAlt"
        initialUrl={project?.previewImageUrl}
        initialAlt={project?.previewImageAlt}
      />
      {fe.previewImageUrl?.map((e) => (
        <p key={e} className="text-sm text-ink">
          {e}
        </p>
      ))}
      {fe.previewImageAlt?.map((e) => (
        <p key={e} className="text-sm text-ink">
          {e}
        </p>
      ))}

      <fieldset className="border-t border-line pt-6">
        <legend className="text-sm text-muted">
          Testimonial (optional)
        </legend>
        <div className="mt-4 space-y-6">
          <Field
            label="Quote"
            name="testimonialQuote"
            defaultValue={project?.testimonial?.quote}
            errors={fe["testimonial.quote"]}
            maxLength={1000}
            as="textarea"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Author name"
              name="testimonialAuthor"
              defaultValue={project?.testimonial?.authorName}
              errors={fe["testimonial.authorName"]}
              maxLength={100}
            />
            <Field
              label="Author role"
              name="testimonialRole"
              defaultValue={project?.testimonial?.role}
              maxLength={120}
            />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-3 border-b border-ink pb-1 text-lg text-ink transition-opacity duration-micro hover:opacity-60 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
