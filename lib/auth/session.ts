/**
 * Pure session-validity logic (Task 12.1; Property 12, Req 4.6).
 *
 * Kept pure so it can be property-tested directly. A session is valid iff the
 * time since last activity is strictly less than the inactivity limit; an
 * explicit sign-out always renders it invalid.
 */

export const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

export function isSessionValid(input: {
  lastActive: number;
  now: number;
  signedOut?: boolean;
}): boolean {
  if (input.signedOut) return false;
  return input.now - input.lastActive < INACTIVITY_LIMIT_MS;
}
