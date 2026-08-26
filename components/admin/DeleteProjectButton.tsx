"use client";

import { useState } from "react";
import { deleteProjectAction } from "@/app/actions/projects";

/**
 * Delete button with explicit confirmation (Task 13.2, Req 5.7).
 * The destructive action requires a second confirming click.
 */
export function DeleteProjectButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-muted transition-colors duration-micro hover:text-ink"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-sm">
      <span className="text-muted">Are you sure?</span>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          await deleteProjectAction(id);
        }}
        className="border-b border-ink pb-0.5 text-ink transition-opacity duration-micro hover:opacity-60 disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-muted transition-colors duration-micro hover:text-ink"
      >
        Cancel
      </button>
    </span>
  );
}
