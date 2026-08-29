import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  type LockoutState,
  initialLockoutState,
  isLockedOut,
  registerFailure,
  registerSuccess,
} from "./lockout";

/**
 * DB-backed lockout store (Task 12.4; Req 4.5).
 *
 * The auth_attempts table has RLS enabled with no client policies, so it can
 * only be reached with the service-role key. This module is server-only and
 * the service client is created lazily so the public site never needs the key.
 *
 * If the service-role key is not configured, lockout tracking degrades to
 * "never locked" rather than blocking sign-in entirely.
 */

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeKey(email: string): string {
  return email.trim().toLowerCase();
}

type AuthAttemptRow = {
  failed_count: number | null;
  locked_until: string | null;
};

async function readState(
  client: SupabaseClient,
  accountKey: string,
): Promise<LockoutState> {
  const { data } = await client
    .from("auth_attempts")
    .select("failed_count, locked_until")
    .eq("account_key", accountKey)
    .maybeSingle<AuthAttemptRow>();
  if (!data) return initialLockoutState;
  return {
    failedCount: data.failed_count ?? 0,
    lockedUntil: data.locked_until
      ? new Date(data.locked_until).getTime()
      : null,
  };
}

async function writeState(
  client: SupabaseClient,
  accountKey: string,
  state: LockoutState,
): Promise<void> {
  await client.from("auth_attempts").upsert(
    {
      account_key: accountKey,
      failed_count: state.failedCount,
      locked_until: state.lockedUntil
        ? new Date(state.lockedUntil).toISOString()
        : null,
      last_failed_at: new Date().toISOString(),
    },
    { onConflict: "account_key" },
  );
}

/** Returns whether the account is currently locked out. */
export async function checkLockout(email: string): Promise<{
  locked: boolean;
  retryAfterMs?: number;
}> {
  const client = serviceClient();
  if (!client) return { locked: false };
  const key = normalizeKey(email);
  const state = await readState(client, key);
  const now = Date.now();
  if (isLockedOut(state, now)) {
    return { locked: true, retryAfterMs: (state.lockedUntil ?? now) - now };
  }
  return { locked: false };
}

/** Records a failed attempt and returns the updated lockout status. */
export async function recordFailure(email: string): Promise<{
  locked: boolean;
}> {
  const client = serviceClient();
  if (!client) return { locked: false };
  const key = normalizeKey(email);
  const now = Date.now();
  const current = await readState(client, key);
  const next = registerFailure(current, now);
  await writeState(client, key, next);
  return { locked: isLockedOut(next, now) };
}

/** Clears the failure counter after a successful sign-in. */
export async function recordSuccess(email: string): Promise<void> {
  const client = serviceClient();
  if (!client) return;
  const key = normalizeKey(email);
  await writeState(client, key, registerSuccess());
}
