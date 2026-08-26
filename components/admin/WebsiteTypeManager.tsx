"use client";

import { useActionState, useRef, useEffect } from "react";
import type { WebsiteType } from "@/lib/schema/content";
import {
  createWebsiteTypeAction,
  deleteWebsiteTypeAction,
  type ContentFormState,
} from "@/app/actions/content";

const initial: ContentFormState = { status: "idle" };

/**
 * Website types manager (Task 13.5). Add form + list with delete.
 * Requirements: 5.2, 5.6, 11.1.
 */
export function WebsiteTypeManager({ types }: { types: WebsiteType[] }) {
  const [state, formAction, pending] = useActionState(
    createWebsiteTypeAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const fe = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <div className="space-y-10">
      <form ref={formRef} action={formAction} className="space-y-5">
        {state.formError && (
          <p role="alert" className="text-sm text-ink">
            {state.formError}
          </p>
        )}
        {state.status === "success" && (
          <p role="status" className="text-sm text-muted">
            Saved.
          </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm text-muted">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={80}
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
          />
          {fe.name?.map((e) => (
            <p key={e} className="mt-1 text-sm text-ink">
              {e}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm text-muted">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            maxLength={400}
            rows={3}
            className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
          />
          {fe.description?.map((e) => (
            <p key={e} className="mt-1 text-sm text-ink">
              {e}
            </p>
          ))}
        </div>
        <div>
          <label htmlFor="sortOrder" className="block text-sm text-muted">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={types.length + 1}
            className="mt-2 w-24 border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="border-b border-ink pb-1 text-ink transition-opacity duration-micro hover:opacity-60 disabled:opacity-50"
        >
          {pending ? "Adding..." : "Add website type"}
        </button>
      </form>

      {types.length > 0 && (
        <ul className="divide-y divide-line border-y border-line">
          {types.map((type) => (
            <li
              key={type.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div>
                <p className="font-medium text-ink">{type.name}</p>
                <p className="mt-1 text-sm text-muted">{type.description}</p>
              </div>
              <form action={deleteWebsiteTypeAction.bind(null, type.id)}>
                <button
                  type="submit"
                  className="shrink-0 text-sm text-muted transition-colors duration-micro hover:text-ink"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
