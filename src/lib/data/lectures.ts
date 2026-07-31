import type { Lecture } from "@/types/content";
import { AHMAD } from "@/lib/data/authors";

/**
 * Lecture placeholders — no YouTube IDs yet, so cards render a
 * static thumbnail. Once recordings are published, set `youtubeId`
 * and the same card renders a real embed with no markup changes.
 */
export const LECTURES: readonly Lecture[] = [
  {
    id: "lecture-friday-khutbah-gratitude",
    slug: "friday-khutbah-the-weight-of-gratitude",
    title: "Friday Khutbah: The Weight of Gratitude",
    excerpt: "A Jumu'ah address from Masjid Al-Noor on shukr as a discipline, not just a feeling.",
    status: "coming-soon",
    speaker: AHMAD,
    category: "Weekly Khutbah",
    durationMinutes: 22,
  },
  {
    id: "lecture-names-of-allah",
    slug: "the-names-of-allah",
    title: "The Names of Allah, Applied",
    excerpt: "A short series on drawing practical guidance from Al-Asma ul-Husna.",
    status: "coming-soon",
    speaker: AHMAD,
    category: "Lecture",
    durationMinutes: 38,
  },
  {
    id: "lecture-seerah-in-crisis",
    slug: "seerah-in-times-of-crisis",
    title: "The Seerah in Times of Crisis",
    excerpt: "What the Prophet's response to hardship in Makkah, peace be upon him, teaches about ours.",
    status: "coming-soon",
    speaker: AHMAD,
    category: "Conference Talk",
    durationMinutes: 45,
  },
  {
    id: "lecture-raising-believing-children",
    slug: "raising-believing-children",
    title: "Raising Believing Children",
    excerpt: "A practical talk on instilling faith without coercion.",
    status: "coming-soon",
    speaker: AHMAD,
    category: "Seminar",
    durationMinutes: 41,
  },
] as const;

export function getAllLectures(): readonly Lecture[] {
  return LECTURES;
}
