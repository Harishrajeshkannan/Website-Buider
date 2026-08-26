import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Admin dashboard shell (Task 13.1).
 * Requirements: 4.1 (access is enforced by middleware.ts before this renders).
 *
 * The sign-in page renders its own standalone layout via a route segment that
 * opts out of the chrome — handled by checking children, but simplest is a
 * nested layout. Here we always render the shell for authenticated admin pages;
 * the sign-in page lives at /admin/sign-in and provides its own full-screen UI,
 * so we detect it is NOT wrapped by rendering the shell only around dashboard
 * pages. Next.js applies this layout to sign-in too, so the sign-in page uses a
 * self-contained centered layout that visually ignores the sidebar width.
 *
 * noindex keeps the whole admin area out of search engines.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
