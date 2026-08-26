"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/actions/auth";

const initial: SignInState = {};

/**
 * Sign-in form (Task 12.4). Keyboard-operable with labels and visible focus.
 */
export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initial);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error && (
        <p
          role="alert"
          className="border border-ink bg-paper px-4 py-3 text-sm text-ink"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-3 border-b border-ink pb-1 text-lg text-ink transition-opacity duration-micro hover:opacity-60 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
