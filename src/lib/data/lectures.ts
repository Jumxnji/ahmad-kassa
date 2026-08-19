import type { Lecture } from "@/types/content";
import { AHMAD } from "@/lib/data/authors";

/**
 * Two kinds of record live in this array — status/youtubeId tell them
 * apart, and nothing here should be read as one type just because it's
 * in the same list:
 *
 * 1. Real, published khutbahs (`status: "published"`, real `youtubeId`,
 *    `category: "Weekly Khutbah"`) — verified directly against YouTube
 *    (oEmbed + the watch page's own structured data) for title, channel,
 *    publish date, and duration; nothing here is invented. `coverImageUrl`
 *    is the real `maxresdefault` thumbnail YouTube itself serves
 *    (1280x720, true 16:9, no letterboxing) — hotlinked from
 *    `i.ytimg.com`, the same host YouTube's own oEmbed API points to,
 *    not downloaded into the repo. Titles are reproduced verbatim in
 *    wording; only letter-casing was normalised from the channel's
 *    shouted-caps style (e.g. "DOMESTIC VIOLENCE : In Light of...") to
 *    sentence case, to match this site's own typesetting — no word was
 *    added, removed, or reordered. `excerpt` stays deliberately minimal
 *    and factual — two of the three videos' own YouTube descriptions are
 *    empty, and the third's is a donation-appeal paragraph, not a clean
 *    "about this khutbah" description — so all three share one honest
 *    factual line rather than inventing interpretive summary text or
 *    reproducing fundraising copy. One additional normalisation on the
 *    third video specifically: YouTube's real title is "Lessons from the
 *    Prophet's Farewell Sermon Part 2 | Ustadh Ahmad Mohamed Kassa" — the
 *    " | Ustadh Ahmad Mohamed Kassa" is the channel's own appended byline,
 *    not part of the talk's actual title, and is dropped here for the
 *    same reason every other page on this site never calls him "Ustadh"
 *    (see `docs/BRAND_USAGE.md`) — his name and the Masjid Al-Noor source
 *    are already established elsewhere on the page without it.
 * 2. Intentional unpublished placeholders (`status: "coming-soon"`, no
 *    `youtubeId`) — real future talks Ahmad has planned, not fake/demo
 *    content, but with no recording yet. `LatestKhutbahSection` only
 *    ever selects `category: "Weekly Khutbah"` entries, so these
 *    (Lecture/Conference Talk/Seminar) never surface on the homepage;
 *    no public route currently lists the full catalog either. They stay
 *    here as the same stable contract the original placeholder comment
 *    described — do not present one as if it had a real recording.
 */
export const LECTURES: readonly Lecture[] = [
  {
    id: "lecture-domestic-violence-quran-sunnah",
    slug: "domestic-violence-in-light-of-the-quran-and-sunnah",
    title: "Domestic Violence: In Light of the Qur'an and Sunnah",
    excerpt: "A Jumu'ah khutbah delivered at Masjid Al-Noor, East London.",
    coverImageUrl: "https://i.ytimg.com/vi/sA6wi43Jj9A/maxresdefault.jpg",
    status: "published",
    publishedAt: "2024-10-21",
    speaker: AHMAD,
    category: "Weekly Khutbah",
    durationMinutes: 20,
    youtubeId: "sA6wi43Jj9A",
  },
  {
    id: "lecture-parental-conflicts-child-mental-health",
    slug: "parental-conflicts-impact-on-child-mental-health",
    title: "Parental Conflicts: Impact on Child Mental Health",
    excerpt: "A Jumu'ah khutbah delivered at Masjid Al-Noor, East London.",
    coverImageUrl: "https://i.ytimg.com/vi/mEuDvsEGHhg/maxresdefault.jpg",
    status: "published",
    publishedAt: "2024-09-28",
    speaker: AHMAD,
    category: "Weekly Khutbah",
    durationMinutes: 19,
    youtubeId: "mEuDvsEGHhg",
  },
  {
    id: "lecture-farewell-sermon-part-2",
    slug: "lessons-from-the-prophets-farewell-sermon-part-2",
    title: "Lessons from the Prophet's Farewell Sermon Part 2",
    excerpt: "A Jumu'ah khutbah delivered at Masjid Al-Noor, East London.",
    coverImageUrl: "https://i.ytimg.com/vi/du8JPMOcgBQ/maxresdefault.jpg",
    status: "published",
    publishedAt: "2023-07-21",
    speaker: AHMAD,
    category: "Weekly Khutbah",
    durationMinutes: 29,
    youtubeId: "du8JPMOcgBQ",
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
