import "server-only";
import { anonServerClient, authServerClient } from "./clients";
import {
  withTimeout,
  type Result,
  type DbError,
  type ValidationError,
} from "./result";
import { mapInquiry } from "./mappers";
import { InquiryInput, type Inquiry } from "@/lib/schema/inquiry";

/**
 * Inquiry data access (Task 5.5).
 * Requirements: 6.1, 15.3, 15.7
 */

/** Public insert of a contact-form submission (Req 15.3). */
export async function createInquiry(
  raw: unknown,
): Promise<Result<Inquiry, ValidationError | DbError>> {
  const parsed = InquiryInput.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_form";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, error: { kind: "validation", fieldErrors } };
  }

  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
      })
      .select("*")
      .abortSignal(signal)
      .single();
    if (error) throw new Error(error.message);
    return mapInquiry(data);
  });
}

/** Admin read of a single inquiry by id (Req 6.2). */
export async function getInquiry(
  id: string,
): Promise<Result<Inquiry | null, DbError>> {
  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .abortSignal(signal)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapInquiry(data) : null;
  });
}

/** Admin read of all inquiries, most recent first (Req 6.1). */
export async function listInquiries(): Promise<Result<Inquiry[], DbError>> {
  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapInquiry);
  });
}
