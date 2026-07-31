import type { Metadata } from "next";
import { Brain } from "lucide-react";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { CourseCard } from "@/components/cards/course-card";
import { COURSE_ICONS } from "@/components/cards/course-icons";
import { getAllCourses } from "@/lib/data/courses";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description: "Structured courses from Ahmad Mohamed Kassa — coming soon.",
  path: "/courses",
});

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <>
      <Section containerWidth="content" className="text-center">
        <PageHeader
          align="center"
          eyebrow="The academy"
          title="Structured study, coming soon"
          description="A sequenced academy in Aqeedah, Fiqh, and Arabic — built for depth, not just completion. Each course moves from first principles to real competence, the same way Ahmad teaches in person."
        />
        <ManuscriptDivider className="mx-auto mt-12 max-w-xs" />
      </Section>

      <Section tone="alt">
        <div className="max-w-xl">
          <Eyebrow>In development</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl">What&rsquo;s coming</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              icon={COURSE_ICONS[course.slug] ?? Brain}
            />
          ))}
        </div>
      </Section>

      <Section containerWidth="content" className="text-center">
        <Eyebrow>Be the first to know</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-md text-3xl sm:text-4xl">
          Join the newsletter for enrollment
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
          No spam, no countdown gimmicks — just one email the moment
          enrollment opens.
        </p>
        <div className="mx-auto mt-8 max-w-sm">
          <NewsletterForm />
        </div>
      </Section>
    </>
  );
}
