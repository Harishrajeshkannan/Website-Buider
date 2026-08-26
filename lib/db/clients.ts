import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Cookie-free anon client for contexts without a request scope, e.g.
 * `generateStaticParams` at build time. Uses the anon key + public RLS, so it
 * only ever sees publicly-readable content — never a session.
 */
export function staticAnonClient() {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Supabase client factories (Task 1.3).
 *
 * Two distinct server-side clients keep Row Level Security as the enforcement
 * boundary (design: Architecture / Supabase clients):
 *
 * - anonServerClient:  uses the anon key, subject to public RLS policies.
 *                      Used for public reads (Req 2.1, 2.2) and public
 *                      inquiry inserts (Req 15.3).
 * - authServerClient:  uses the signed-in admin session cookie for
 *                      authenticated reads/writes (Req 4.1, 5.3, 6).
 *
 * No service-role key is used in request paths, so a compromised page can
 * never bypass RLS. Both clients are server-only (enforced by "server-only").
 */

/**
 * Public/anon client. Reads and inquiry inserts only; RLS restricts the rest.
 * Cookies are read-only here because public reads must not mutate the session.
 */
export async function anonServerClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // no-op: public client does not manage the auth session
      },
    },
  });
}

/**
 * Authenticated client bound to the admin session cookie. Used inside server
 * actions / route handlers that can write cookies (session refresh).
 */
export async function authServerClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render where cookies are immutable.
          // Session refresh is handled by middleware in that case.
        }
      },
    },
  });
}
