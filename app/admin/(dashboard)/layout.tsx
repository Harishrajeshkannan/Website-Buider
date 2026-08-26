import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Dashboard chrome (Task 13.1) — wraps all authenticated admin pages with the
 * sidebar. The sign-in page lives outside this route group so it stays chrome-
 * free. Access is enforced by middleware.ts before any of this renders (Req 4.1).
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 h-screen w-56 shrink-0 border-r border-line py-8">
        <AdminNav />
      </aside>
      <div className="flex-1 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
