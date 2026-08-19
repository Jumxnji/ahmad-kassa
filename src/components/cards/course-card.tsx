import { type LucideIcon } from "lucide-react";
import type { Course } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { CourseIllustration } from "@/components/media/course-illustration";
import { CourseInterestLink } from "@/components/cards/course-interest-link";

const LEVEL_LABELS: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface CourseCardProps {
  course: Course;
  icon: LucideIcon;
}

export function CourseCard({ course, icon }: CourseCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <CourseIllustration icon={icon} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="border-none bg-gold-100 text-gold-700">
            Coming soon
          </Badge>
          <span className="text-xs text-muted-foreground">
            {LEVEL_LABELS[course.level]}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl leading-snug text-foreground">
          {course.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.excerpt}
        </p>
        <CourseInterestLink courseSlug={course.slug} />
      </div>
    </div>
  );
}
