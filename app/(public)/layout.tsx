import type { ReactNode } from "react";
import { getSiteContent } from "@/lib/db/read";
import { resolveContent } from "@/lib/content-helpers";
import { SiteNav } from "@/components/public/SiteNav";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ScrollProgress } from "@/components/public/motion/ScrollProgress";
import { BackgroundField } from "@/components/public/motion/BackgroundField";

/**
 * Public layout shell (Task 9.1).
 * Fetches site content for nav/footer branding with placeholder fallback.
 */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await getSiteContent();
  const content = resolveContent(result.ok ? result.value : null);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Connected dots background — fixed, behind content */}
      <BackgroundField />
      <ScrollProgress />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter
          ownerName={content.ownerName}
          contactEmail={content.contactEmail}
        />
      </div>
    </div>
  );
}
