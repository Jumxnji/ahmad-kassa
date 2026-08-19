import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { KhutbahEntry } from "@/components/cards/khutbah-entry";
import { getAllLectures } from "@/lib/data/lectures";

// The real Masjid Al-Noor channel — confirmed via YouTube's own oEmbed
// API against the khutbah URLs added in Sprints 18–19. Deliberately not
// read from `siteConfig.socialLinks`/`SOCIAL_LINKS`, which still holds a
// generic placeholder domain sitewide (see docs/PROJECT_MEMORY.md) —
// this is a targeted, single-purpose link for this section only, not a
// change to the sitewide social configuration. The link goes to the full
// channel, not an Ahmad-specific playlist, so the label says "on
// YouTube," not "Ahmad's channel."
const MASJID_AL_NOOR_YOUTUBE = "https://www.youtube.com/@MasjidAlNoorOfficial";

/**
 * Shows real published khutbahs, most recent first — genuine chronology
 * by `publishedAt`, never array order. The newest gets full editorial
 * prominence (`variant="primary"`); up to two next-most-recent khutbahs
 * form a quieter secondary column (`variant="secondary"`) — a deliberate
 * cap, not a growing feed, matching "a small curated selection" rather
 * than "everything ever published." Falls back to nothing (`null`)
 * rather than a fake "coming soon" card if no khutbah has been published
 * yet — the same honesty the section held to before real recordings
 * existed.
 */
export function LatestKhutbahSection() {
  const khutbahs = [...getAllLectures()]
    .filter((lecture) => lecture.category === "Weekly Khutbah" && lecture.youtubeId)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  const [primary, ...rest] = khutbahs;
  const secondary = rest.slice(0, 2);
  if (!primary) return null;

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
            secondary.length > 0
              ? "mx-auto mt-10 grid gap-10 text-left lg:grid-cols-[1.6fr_1fr] lg:gap-14"
              : "mx-auto mt-10 max-w-lg text-left"
          }
        >
          <KhutbahEntry lecture={primary} variant="primary" />
          {secondary.length > 0 && (
            <div className="flex flex-col gap-8 lg:justify-between">
              {secondary.map((lecture, i) => (
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
