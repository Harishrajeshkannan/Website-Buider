"use server";

import { createInquiry } from "@/lib/db/inquiries";
import { sendInquiryNotification } from "@/lib/email";

/**
 * Contact submit server action (Task 9.9).
 * Requirements: 15.3 (persist), 15.5/15.6 (validation), 15.7 (delivery error).
 *
 * Returns a plain serializable state the client form renders. Entered values
 * are retained by the client, so this only needs to report status + errors.
 */

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string[]>;
  formError?: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const countryCode = String(formData.get("countryCode") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    // Combine the editable country code and number into one stored value.
    phone: phoneNumber ? `${countryCode} ${phoneNumber}`.trim() : "",
    message: String(formData.get("message") ?? ""),
  };

  const result = await createInquiry(raw);

  if (result.ok) {
    // Notify by email after the inquiry is safely persisted. Best-effort:
    // an email failure must not fail the submission (the lead is already saved).
    await sendInquiryNotification(result.value);
    return { status: "success" };
  }

  if (result.error.kind === "validation") {
    return { status: "error", fieldErrors: result.error.fieldErrors };
  }

  // DB timeout / unreachable / unknown -> delivery error (Req 15.7)
  return {
    status: "error",
    formError:
      "Your message couldn't be sent right now. Please try again in a moment.",
  };
}
