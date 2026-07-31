import type { Course } from "@/types/content";
import { AHMAD } from "@/lib/data/authors";

/**
 * The academy hasn't launched — these are the courses in active
 * planning, shown as "Coming soon" so visitors know what to expect
 * and can join the newsletter for the enrollment announcement.
 */
export const COURSES: readonly Course[] = [
  {
    id: "course-psychology-in-islam",
    slug: "psychology-in-islam",
    title: "Psychology in Islam",
    excerpt:
      "How the Qur'an and Sunnah describe the nafs, the heart, and desire — and what that framework offers modern mental health.",
    status: "coming-soon",
    instructor: AHMAD,
    level: "intermediate",
    modules: [
      { id: "m1", title: "The Architecture of the Self", lessonCount: 4 },
      { id: "m2", title: "Desire, Discipline, and the Nafs", lessonCount: 5 },
      { id: "m3", title: "Grief, Anxiety, and Sabr", lessonCount: 4 },
    ],
  },
  {
    id: "course-marriage-in-islam",
    slug: "marriage-in-islam",
    title: "Marriage in Islam",
    excerpt:
      "A sequenced course on rights, expectations, and mercy — for engaged couples and anyone rebuilding a marriage's foundation.",
    status: "coming-soon",
    instructor: AHMAD,
    level: "beginner",
    modules: [
      { id: "m1", title: "Before the Contract", lessonCount: 3 },
      { id: "m2", title: "Rights and Responsibilities", lessonCount: 5 },
      { id: "m3", title: "Conflict and Repair", lessonCount: 4 },
    ],
  },
  {
    id: "course-foundations-of-ruqyah",
    slug: "foundations-of-ruqyah",
    title: "Foundations of Ruqyah",
    excerpt:
      "A practical, text-grounded course on Ruqyah — what it is, what it isn't, and how to practice it soundly.",
    status: "coming-soon",
    instructor: AHMAD,
    level: "beginner",
    modules: [
      { id: "m1", title: "Aqeedah Foundations", lessonCount: 3 },
      { id: "m2", title: "Method and Practice", lessonCount: 6 },
      { id: "m3", title: "Common Misconceptions", lessonCount: 3 },
    ],
  },
  {
    id: "course-islamic-family-guidance",
    slug: "islamic-family-guidance",
    title: "Islamic Family Guidance",
    excerpt:
      "Raising children, caring for parents, and holding a household together — guidance drawn from the Seerah and the fiqh of family.",
    status: "coming-soon",
    instructor: AHMAD,
    level: "beginner",
    modules: [
      { id: "m1", title: "The Household as a Trust", lessonCount: 4 },
      { id: "m2", title: "Raising Children", lessonCount: 5 },
      { id: "m3", title: "Honoring Parents", lessonCount: 3 },
    ],
  },
  {
    id: "course-understanding-aqeedah",
    slug: "understanding-aqeedah",
    title: "Understanding Aqeedah",
    excerpt:
      "The foundations of Islamic belief, built from first principles — for the student who wants certainty grounded in evidence, not assumption.",
    status: "coming-soon",
    instructor: AHMAD,
    level: "beginner",
    modules: [
      { id: "m1", title: "What Aqeedah Is, and Why It Matters", lessonCount: 3 },
      { id: "m2", title: "The Names and Attributes of Allah", lessonCount: 5 },
      { id: "m3", title: "Belief in the Unseen", lessonCount: 4 },
    ],
  },
] as const;

export function getAllCourses(): readonly Course[] {
  return COURSES;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}
