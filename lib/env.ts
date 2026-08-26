/**
 * Typed access to environment variables.
 * Public (NEXT_PUBLIC_*) values are safe to expose to the browser.
 *
 * Fallback/placeholder content (Req 7.4, 7.5, 14.3) is read here so the
 * render layer can substitute configured placeholders for missing DB values.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    // At runtime on the server we surface a clear message; the public site
    // still degrades gracefully because reads return typed error Results.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl(): string {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey(): string {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
} as const;

/**
 * Configured placeholder fallbacks for site content fields.
 * These are intentionally non-throwing: missing env just yields a sensible default.
 */
export const contentPlaceholders = {
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME_FALLBACK ?? "Your Name",
  tagline:
    process.env.NEXT_PUBLIC_TAGLINE_FALLBACK ?? "Websites that mean business",
  serviceStatement:
    "I design and build premium websites for modern businesses.",
  aboutText:
    "I'm an independent web designer and developer helping businesses show up online with clarity and craft.",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL_FALLBACK ?? "hello@example.com",
} as const;
