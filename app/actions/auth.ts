"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { authServerClient } from "@/lib/db/clients";
import {
  checkLockout,
  recordFailure,
  recordSuccess,
} from "@/lib/auth/lockout-store";

/**
 * Sign-in / sign-out server actions with lockout gate (Task 12.4).
 * Requirements: 4.3 (grant on valid), 4.4 (error on invalid), 4.5 (lockout),
 * 4.6 (sign-out ends session).
 */

export type SignInState = { error?: string };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // Lockout gate before attempting credentials (Req 4.5)
  const lock = await checkLockout(email);
  if (lock.locked) {
    const minutes = Math.ceil((lock.retryAfterMs ?? 0) / 60000);
    return {
      error: `Too many failed attempts. This account is temporarily locked. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const supabase = await authServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const result = await recordFailure(email);
    if (result.locked) {
      return {
        error:
          "Too many failed attempts. This account is now temporarily locked for 15 minutes.",
      };
    }
    // Req 4.4 — do not reveal which part was wrong
    return { error: "The email or password you entered is not correct." };
  }

  // Success (Req 4.3): reset lockout, seed the activity timestamp.
  await recordSuccess(email);
  const cookieStore = await cookies();
  cookieStore.set("admin_last_active", String(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await authServerClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete("admin_last_active");
  redirect("/admin/sign-in");
}
