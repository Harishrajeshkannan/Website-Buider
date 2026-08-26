/**
 * Shared validation primitives (Task 2.1).
 *
 * These are pure functions so they can be property-tested directly
 * (Properties 4 and 29) and reused across Zod schemas.
 */

/**
 * Validates an absolute http(s) URL using the WHATWG URL constructor.
 * Accepts iff the string parses as a URL with an http or https protocol
 * (Req 1.7, 5.6).
 */
export function isValidHttpUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Validates the email format required by Req 15.6:
 * - exactly one "@" symbol
 * - at least one character before the "@"
 * - at least one dot-separated domain after the "@"
 *   (i.e. the domain contains a dot with non-empty labels on both sides)
 *
 * This intentionally does NOT implement the full RFC 5322 grammar; it enforces
 * exactly the rule the requirement specifies so behavior is predictable.
 */
export function isValidEmail(value: string): boolean {
  // Exactly one "@"
  const atCount = (value.match(/@/g) ?? []).length;
  if (atCount !== 1) return false;

  const [local, domain] = value.split("@");

  // At least one character before the "@"
  if (local.length === 0) return false;

  // At least one dot-separated domain after the "@":
  // must contain a dot, with non-empty labels around every dot.
  if (!domain.includes(".")) return false;

  const labels = domain.split(".");
  if (labels.some((label) => label.length === 0)) return false;

  return true;
}
