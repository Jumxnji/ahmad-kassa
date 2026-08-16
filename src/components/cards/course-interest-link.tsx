"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/** Small client island so CourseCard itself can stay a Server Component (it receives a Lucide icon component as a prop, which can't cross a client boundary). */
export function CourseInterestLink({ courseSlug }: { courseSlug: string }) {
  return (
    <Link
      href="/newsletter"
      onClick={() => trackEvent({ name: "course_interest_click", props: { courseSlug } })}
      className="mt-4 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-navy-800 transition-colors hover:text-gold-600"
    >
      <Bell className="size-3.5" strokeWidth={1.5} />
      Notify me at launch
    </Link>
  );
}
