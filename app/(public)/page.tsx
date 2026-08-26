import { getProjects, getWebsiteTypes, getSiteContent } from "@/lib/db/read";
import { resolveContent, buildProcessStages } from "@/lib/content-helpers";
import { LeftRail } from "@/components/public/LeftRail";
import { RightColumn } from "@/components/public/RightColumn";
import { Spotlight } from "@/components/public/motion/Spotlight";

/**
 * Home page — split layout (reference: brittanychiang.com).
 * Sticky identity/nav rail on the left, scrolling content on the right, so the
 * page fills the viewport instead of stacking airy centered bands.
 * Requirements: 2.4 + each section's requirements. ISR keeps it fresh.
 */
export const revalidate = 5;

export default async function HomePage() {
  const [projectsRes, typesRes, contentRes] = await Promise.all([
    getProjects(),
    getWebsiteTypes(),
    getSiteContent(),
  ]);

  const projects = projectsRes.ok ? projectsRes.value : [];
  const websiteTypes = typesRes.ok ? typesRes.value : [];
  const siteContent = contentRes.ok ? contentRes.value : null;

  const content = resolveContent(siteContent);
  const stages = buildProcessStages(siteContent);
  const dbError = !projectsRes.ok || !typesRes.ok || !contentRes.ok;

  return (
    <>
      <Spotlight />
      <div className="mx-auto max-w-editorial px-6 md:px-10 lg:flex lg:gap-16">
        {/* Sticky left rail */}
        <div className="pt-16 lg:w-[42%] lg:pt-0">
          <LeftRail
            ownerName={content.ownerName}
            tagline={content.tagline}
            serviceStatement={content.serviceStatement}
          />
        </div>

        {/* Scrolling right column */}
        <div className="lg:w-[58%]">
          {dbError && (
            <p role="alert" className="pt-6 text-sm text-muted">
              Some content couldn&apos;t be loaded right now. Please refresh in a
              moment.
            </p>
          )}
          <RightColumn
            projects={projects}
            websiteTypes={websiteTypes}
            stages={stages}
            aboutText={content.aboutText}
          />
        </div>
      </div>
    </>
  );
}
