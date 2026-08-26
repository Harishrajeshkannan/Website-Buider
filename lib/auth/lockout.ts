/**
 * Pure lockout state machine (Task 12.4; Property 11, Req 4.5).
 *
 * After 5 consecutive invalid-credential attempts for one account, further
 * attempts are blocked for 15 minutes. Kept pure so it can be property-tested
 * without a database.
 */

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export type LockoutState = {
  failedCount: number;
  lockedUntil: number | null;
};

export const initialLockoutState: LockoutState = {
  failedCount: 0,
  lockedUntil: null,
};

/** Whether an attempt is currently blocked by an active lockout. */
export function isLockedOut(state: LockoutState, now: number): boolean {
  return state.lockedUntil !== null && now < state.lockedUntil;
}

/** New state after a failed attempt. Reaching the max engages the lockout. */
export function registerFailure(
  state: LockoutState,
  now: number,
): LockoutState {
  const failedCount = state.failedCount + 1;
  if (failedCount >= MAX_FAILED_ATTEMPTS) {
    return { failedCount, lockedUntil: now + LOCKOUT_DURATION_MS };
  }
  return { failedCount, lockedUntil: null };
}

/** New state after a successful sign-in: counters reset. */
export function registerSuccess(): LockoutState {
  return { ...initialLockoutState };
}
