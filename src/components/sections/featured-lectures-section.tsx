import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { KhutbahEntry } from "@/components/cards/khutbah-entry";
import { homepageService } from "@/services/homepage.service";
import { AHMAD } from "@/lib/data/authors";
import type { Lecture } from "@/types/content";
import type { Video } from "@/generated/prisma/client";

// The real Masjid Al-Noor channel — confirmed via YouTube's own oEmbed
// API against the khutbah URLs added in Sprints 18–19. Deliberately not
// read from `siteConfig.socialLinks`/`SOCIAL_LINKS`, which still holds a
// generic placeholder domain sitewide (see docs/PROJECT_MEMORY.md) —
// this is a targeted, single-purpose link for this section only, not a
// change to the sitewide social configuration. The link goes to the full
// channel, not an Ahmad-specific playlist, so the label says "on
// YouTube," not "Ahmad's channel."
const MASJID_AL_NOOR_YOUTUBE = "https://www.youtube.com/@MasjidAlNoorOfficial";

/** Adapts a DB `Video` row into the `Lecture` shape `KhutbahEntry` renders — `excerpt`/`category`/`status` are required by that shared type but never actually read by the component, so they're filled with stable, non-invented values rather than sourced from the CMS. */
function toLecture(video: Video): Lecture {
  return {
    id: video.id,
    slug: video.slug,
    title: video.title,
    excerpt: video.source ? `A Jumu'ah khutbah delivered at ${video.source}.` : "A Jumu'ah khutbah.",
    coverImageUrl: video.thumbnailUrl,
    status: "published",
    publishedAt: video.publishedAt?.toISOString(),
    speaker: AHMAD,
    category: "Weekly Khutbah",
    durationMinutes: video.durationMinutes ?? undefined,
    youtubeId: video.youtubeId,
  };
}

/**
 * Shows the homepage editor's three explicit khutbah picks (Sprint 24),
 * resolved to real published `Video` rows and gap-compressed by
 * `resolveFeaturedKhutbahs()` — never invents content, never shows a
 * broken card if a pick is missing/unpublished. Falls back to nothing
 * (`null`) rather than a fake "coming soon" card if no khutbah is
 * available, the same honesty the section held to before real
 * recordings existed.
 */
export async function LatestKhutbahSection() {
  const { primary, secondary } = await homepageService.resolveFeaturedKhutbahs();
  if (!primary) return null;

  const primaryLecture = toLecture(primary);
  const secondaryLectures = secondary.map(toLecture);

  return (
    <Section tone="alt" size="lg">
      <ScrollReveal className="mx-auto max-w-3xl text-center">
        <Eyebrow>Latest khutbah</Eyebrow>
        <h2 className="mt-3 text-3xl sm:text-4xl">Friday reminders, in full</h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          Jumu&rsquo;ah addresses from Masjid Al-Noor.
        </p>

        <div
          className={
            secondaryLectures.length > 0
              ? "mx-auto mt-10 grid gap-10 text-left lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
              : "mx-auto mt-10 max-w-lg text-left"
          }
        >
          <KhutbahEntry lecture={primaryLecture} variant="primary" />
          {secondaryLectures.length > 0 && (
            <div className="flex flex-col gap-8 lg:justify-between">
              {secondaryLectures.map((lecture, i) => (
                <KhutbahEntry
                  key={lecture.id}
                  lecture={lecture}
                  variant="secondary"
                  className={i > 0 ? "border-t border-stone-200 pt-6" : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-left">
          <Button asChild variant="link" className="h-auto px-0">
            <a href={MASJID_AL_NOOR_YOUTUBE} target="_blank" rel="noopener noreferrer">
              More khutbahs on YouTube &rarr;
            </a>
          </Button>
        </div>
      </ScrollReveal>
    </Section>
  );
}
