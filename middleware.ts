import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Auth guard + inactivity expiry middleware (Task 12.1).
 * Requirements: 4.1 (admin-only), 4.2 (redirect unauthenticated), 4.6 (30-min
 * inactivity expiry).
 *
 * Runs on every /admin route except the sign-in page itself. Unauthenticated
 * or inactive sessions are redirected to /admin/sign-in without exposing any
 * admin content.
 */

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes (Req 4.6)
const LAST_ACTIVE_COOKIE = "admin_last_active";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The sign-in page must remain publicly reachable.
  if (pathname === "/admin/sign-in") {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signInUrl = new URL("/admin/sign-in", request.url);

  // Not authenticated -> redirect (Req 4.1, 4.2)
  if (!user) {
    return NextResponse.redirect(signInUrl);
  }

  // Inactivity expiry (Req 4.6)
  const lastActiveRaw = request.cookies.get(LAST_ACTIVE_COOKIE)?.value;
  const now = Date.now();
  if (lastActiveRaw) {
    const lastActive = Number(lastActiveRaw);
    if (Number.isFinite(lastActive) && now - lastActive > INACTIVITY_LIMIT_MS) {
      await supabase.auth.signOut();
      const expired = NextResponse.redirect(signInUrl);
      expired.cookies.delete(LAST_ACTIVE_COOKIE);
      return expired;
    }
  }

  // Refresh the activity timestamp on each authenticated request.
  response.cookies.set(LAST_ACTIVE_COOKIE, String(now), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
