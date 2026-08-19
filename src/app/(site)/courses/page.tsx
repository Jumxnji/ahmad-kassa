import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { ProgrammeIndex } from "@/components/catalog/programme-index";
import { getAllCourses } from "@/lib/data/courses";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description: "Structured courses from Ahmad Mohamed Kassa — coming soon.",
  path: "/courses",
  useRouteOgImage: true,
});

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <Section containerWidth="wide" className="pt-14 pb-28 sm:pt-16 sm:pb-36">
      <PageHeader
        eyebrow="Courses"
        title="Five programmes in development"
        description="Structured courses in the areas asked about most — built for depth, not just completion."
      />
      <div className="mt-16 flex items-baseline gap-3 border-b border-stone-200 pb-3 lg:mt-20">
        <span className="font-mono text-[11px] tracking-[0.08em] text-stone-500 uppercase">
          Programmes
        </span>
        <span className="ml-auto font-mono text-[11px] tracking-[0.08em] text-stone-400 uppercase">
          01–05
        </span>
      </div>
      <ProgrammeIndex courses={courses} />
    </Section>
  );
}
