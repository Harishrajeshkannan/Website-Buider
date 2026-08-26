"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { isValidEmail } from "@/lib/schema/validators";
import { useState } from "react";

/**
 * Contact form client component (Task 9.8).
 * Requirements: 15.2 (fields), 15.4 (confirmation), 15.5/15.6 (validation +
 * value retention), 15.7 (delivery error). Keyboard-operable with visible
 * focus and associated labels (Req 18.2, 18.3).
 */

const initial: ContactState = { status: "idle" };

function fieldError(state: ContactState, field: string): string | undefined {
  return state.fieldErrors?.[field]?.[0];
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  // Lightweight client-side mirror of the server validation for instant feedback.
  const [values, setValues] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const clientEmailError =
    touched.email && values.email.length > 0 && !isValidEmail(values.email)
      ? "Enter a valid email address"
      : undefined;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border border-ink bg-paper p-8 text-lg text-ink"
      >
        <p className="font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-muted">
          Your message has been received. I&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {state.formError && (
        <p role="alert" className="text-sm text-ink">
          {state.formError}
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={100}
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
        {fieldError(state, "name") && (
          <p className="mt-2 text-sm text-ink">{fieldError(state, "name")}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={254}
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={Boolean(clientEmailError || fieldError(state, "email"))}
          className="mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
        {(clientEmailError || fieldError(state, "email")) && (
          <p className="mt-2 text-sm text-ink">
            {clientEmailError ?? fieldError(state, "email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm text-muted">
          Phone
        </label>
        <div className="mt-2 flex items-end gap-3">
          {/* Editable country code */}
          <div className="w-28 shrink-0">
            <label htmlFor="countryCode" className="sr-only">
              Country code
            </label>
            <input
              id="countryCode"
              name="countryCode"
              type="text"
              inputMode="tel"
              maxLength={5}
              required
              list="country-codes"
              value={values.countryCode}
              onChange={(e) =>
                setValues((v) => ({ ...v, countryCode: e.target.value }))
              }
              className="w-full border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
              aria-label="Country code"
            />
            <datalist id="country-codes">
              <option value="+91">India (+91)</option>
              <option value="+1">USA / Canada (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+61">Australia (+61)</option>
              <option value="+971">UAE (+971)</option>
              <option value="+65">Singapore (+65)</option>
              <option value="+49">Germany (+49)</option>
              <option value="+33">France (+33)</option>
            </datalist>
          </div>

          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            maxLength={15}
            required
            value={values.phoneNumber}
            onChange={(e) =>
              setValues((v) => ({ ...v, phoneNumber: e.target.value }))
            }
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="9080825690"
            className="flex-1 border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
          />
        </div>
        {fieldError(state, "phone") && (
          <p className="mt-2 text-sm text-ink">{fieldError(state, "phone")}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-muted">
          Tell me about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          required
          value={values.message}
          onChange={(e) =>
            setValues((v) => ({ ...v, message: e.target.value }))
          }
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-3 text-lg text-ink outline-none transition-colors duration-micro focus:border-ink"
        />
        {fieldError(state, "message") && (
          <p className="mt-2 text-sm text-ink">
            {fieldError(state, "message")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-3 text-lg text-ink disabled:opacity-50"
      >
        <span className="border-b border-ink pb-1 transition-opacity duration-micro group-hover:opacity-60">
          {pending ? "Sending..." : "Send message"}
        </span>
        <span
          aria-hidden="true"
          className="transition-transform duration-micro group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>
    </form>
  );
}
