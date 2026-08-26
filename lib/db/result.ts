/**
 * Result type, DbError union, and timeout wrapper (Task 5.1; Req 2.3).
 *
 * All data-access functions return Result<T, E> so callers must handle failure
 * explicitly — no unhandled exceptions reach the UI (Property 6).
 */

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/** Distinguishes failure kinds so sections can render the right error state. */
export type DbError =
  | { kind: "timeout" }
  | { kind: "unreachable" }
  | { kind: "unknown"; detail?: string };

/** A validation failure carrying per-field messages (admin/contact writes). */
export type ValidationError = {
  kind: "validation";
  fieldErrors: Record<string, string[]>;
  formError?: string;
};

export const DB_TIMEOUT_MS = 10_000; // Req 2.3

/**
 * Wraps an async operation with a hard timeout. On timeout resolves to a
 * failure Result rather than throwing (Req 2.3, Property 6). Any thrown/rejected
 * error is also mapped to a typed DbError so nothing escapes as an exception.
 */
export async function withTimeout<T>(
  op: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = DB_TIMEOUT_MS,
): Promise<Result<T, DbError>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const value = await op(controller.signal);
    return ok(value);
  } catch (error) {
    if (controller.signal.aborted) {
      return err({ kind: "timeout" });
    }
    const detail = error instanceof Error ? error.message : String(error);
    // Network-level failures from fetch present as TypeErrors.
    if (error instanceof TypeError) {
      return err({ kind: "unreachable" });
    }
    return err({ kind: "unknown", detail });
  } finally {
    clearTimeout(timer);
  }
}
