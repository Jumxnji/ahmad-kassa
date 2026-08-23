// Production bootstrap — deliberately separate from prisma/seed.ts.
//
// prisma/seed.ts is the rich LOCAL DEV seed: sample inbox rows (a
// Question, a ContactMessage, a NewsletterSubscriber) and four
// demo accounts (Owner/Administrator/Editor/Viewer) so every role and
// every dashboard table has something to look at. None of that
// belongs in production — fake inbox rows would sit in the real
// dashboard next to genuine visitor submissions, and unused demo
// accounts are unnecessary attack surface.
//
// This script creates ONLY what a freshly-provisioned production
// database genuinely needs to render the public site and let Ahmad
// sign in:
//   - Site settings (real identity, not a placeholder)
//   - Homepage content + credentials + featured khutbah selections
//   - About content + timeline + education history
//   - The real published book
//   - The three real, already-verified khutbah videos
//   - ONE Owner account, with a freshly generated, printed-once
//     password — never hardcoded, never reused across environments
//
// Every value below is copied verbatim from prisma/seed.ts's real
// (non-placeholder) content — never re-typed or paraphrased — so the
// two seeds can never quietly drift into different "approved" copy.
// If the approved copy ever changes, update it in the CMS after
// bootstrap (the CMS is canonical), not by re-running this script —
// every write below is upsert-guarded to no-op on a second run.
//
// Run once, against production, via:
//   npm run db:seed:production

import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../src/generated/prisma/client";
import { generateSecurePassword, hashPassword } from "../src/lib/password";

// Same Neon WebSocket adapter as src/db/client.ts (see its comment).
neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  // ---- Owner account ------------------------------------------------
  const existingOwner = await db.user.findUnique({ where: { email: "hello@ahmadkassa.com" } });
  let ownerPassword: string | null = null;

  if (!existingOwner) {
    const password = generateSecurePassword();
    const passwordHash = await hashPassword(password);
    await db.user.create({
      data: {
        name: "Ahmad Mohamed Kassa",
        email: "hello@ahmadkassa.com",
        role: "OWNER",
        status: "ACTIVE",
        passwordHash,
      },
    });
    ownerPassword = password;
  }

  // ---- Site settings (singleton) --------------------------------------
  await db.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      websiteName: "Ahmad Mohamed Kassa",
      domain: "https://ahmadkassa.com",
      contactEmail: "hello@ahmadkassa.com",
      socialLinks: {
        youtube: "",
        instagram: "",
        tiktok: "",
      },
      footerText: "Islamic scholarship for the modern seeker.",
      navigation: [
        { label: "About", href: "/about" },
        { label: "Books", href: "/books" },
        { label: "Courses", href: "/courses" },
        { label: "Articles", href: "/articles" },
        { label: "Ask Ahmad", href: "/ask" },
      ],
      brandColors: {
        primary: "#0B1F36",
        accent: "#C6A15B",
        background: "#FAFAF8",
        text: "#111111",
        muted: "#6B7280",
      },
      analyticsIds: {},
    },
  });

  // ---- Book: The Great Debate ------------------------------------------
  // Real, verified values — see prisma/seed.ts's own comment for the
  // provenance of this exact excerpt/description (the book's own
  // printed cover text, quoted verbatim, not invented at seed time).
  const book = await db.book.upsert({
    where: { slug: "the-great-debate" },
    update: {},
    create: {
      title: "The Great Debate",
      slug: "the-great-debate",
      excerpt: "Is It Permissible to Use Jinn in Islamic Exorcism (Ruqyah)?",
      description: "<p>A critical analysis of Ruqyah, and the use of jinn, in light of the Qur'an and Sunnah.</p>",
      amazonUrl:
        "https://www.amazon.co.uk/GREAT-DEBATE-Permissible-Exorcism-Critical-ebook/dp/B0FMYG5YJT/ref=sr_1_1?crid=3V5EV5FKHX4YZ&dib=eyJ2IjoiMSJ9.ZBRv04JZdNMlGYffRW8AWzcpVVQbQO-aXmcpUo6w-CE.fXkFxY_ybyTlOayVbTkANoAGoicuu4moKAS7zrLz-u4&dib_tag=se&keywords=the+great+debate+ahmad+kassa&qid=1785525085&sprefix=the+great+debate+ahmad+kassa%2Caps%2C120&sr=8-1",
      directPurchaseUrl: null,
      status: "PUBLISHED",
      featured: true,
    },
  });

  // ---- Videos (khutbahs) -------------------------------------------------
  // Exact metadata verified against YouTube directly — see
  // prisma/seed.ts's own comment for how each title/date/duration was
  // confirmed. Preserves the exact current public order.
  const SEED_VIDEOS = [
    {
      title: "Domestic Violence: In Light of the Qur'an and Sunnah",
      slug: "domestic-violence-in-light-of-the-quran-and-sunnah",
      youtubeId: "sA6wi43Jj9A",
      publishedAt: new Date("2024-10-21"),
      durationMinutes: 20,
    },
    {
      title: "Parental Conflicts: Impact on Child Mental Health",
      slug: "parental-conflicts-impact-on-child-mental-health",
      youtubeId: "mEuDvsEGHhg",
      publishedAt: new Date("2024-09-28"),
      durationMinutes: 19,
    },
    {
      title: "Lessons from the Prophet's Farewell Sermon Part 2",
      slug: "lessons-from-the-prophets-farewell-sermon-part-2",
      youtubeId: "du8JPMOcgBQ",
      publishedAt: new Date("2023-07-21"),
      durationMinutes: 29,
    },
  ] as const;

  const seededVideos: { id: string }[] = [];
  for (const seedVideo of SEED_VIDEOS) {
    const existingVideo = await db.video.findFirst({ where: { youtubeId: seedVideo.youtubeId } });
    const video =
      existingVideo ??
      (await db.video.create({
        data: {
          title: seedVideo.title,
          slug: seedVideo.slug,
          youtubeId: seedVideo.youtubeId,
          thumbnailUrl: `https://i.ytimg.com/vi/${seedVideo.youtubeId}/maxresdefault.jpg`,
          publishedAt: seedVideo.publishedAt,
          durationMinutes: seedVideo.durationMinutes,
          source: "Masjid Al-Noor",
          category: "Weekly Khutbah",
          status: "PUBLISHED",
        },
      }));
    seededVideos.push({ id: video.id });
  }
  const [primaryKhutbah, supportingKhutbah1, supportingKhutbah2] = seededVideos;

  // ---- Homepage content (singleton) ------------------------------------
  // Every field set explicitly to the current approved copy (not left
  // to schema defaults) so this file is the single source of truth for
  // what a fresh production database receives — see the file header.
  await db.homepageContent.upsert({
    where: { id: "homepage" },
    update: {},
    create: {
      id: "homepage",
      heroEyebrow: "Islamic Teacher · Author · Khateeb",
      heroHeadline: "Ahmad Mohamed Kassa",
      heroSubtitle:
        "Helping Muslims strengthen their understanding of Islam through authentic knowledge, thoughtful research and practical guidance.",
      heroPrimaryCtaLabel: "Explore Books",
      heroPrimaryCtaHref: "/books",
      heroSecondaryCtaLabel: "Browse Articles",
      heroSecondaryCtaHref: "/articles",
      // Legacy/orphaned field (see schema.prisma's own comment) — no
      // production code path reads it, but it's still NOT NULL. Set to
      // the same approved body text rather than any stale placeholder
      // so even a dead column never holds unapproved copy.
      aboutPreviewText:
        "Ahmad Mohamed Kassa studied Arabic and Islamic Studies in Kuwait before completing a degree in Computer Science and Telecommunications and a PGCE at the University of London. He has taught Ruqyah in the UK and abroad since 2009 and serves as Khateeb at Masjid Al-Noor in East London.",
      aboutEyebrow: "Who teaches here",
      aboutSubtitle: "Author · Teacher · Khateeb",
      aboutLede:
        "His work brings together Islamic teaching, community service, and more than fifteen years of experience in Ruqyah.",
      aboutBody:
        "Ahmad Mohamed Kassa studied Arabic and Islamic Studies in Kuwait before completing a degree in Computer Science and Telecommunications and a PGCE at the University of London. He has taught Ruqyah in the UK and abroad since 2009 and serves as Khateeb at Masjid Al-Noor in East London.",
      featuredBookId: book.id,
      primaryKhutbahId: primaryKhutbah.id,
      supportingKhutbah1Id: supportingKhutbah1.id,
      supportingKhutbah2Id: supportingKhutbah2.id,
      newsletterHeadline: "Stay connected, without the noise",
      newsletterText:
        "Book announcements, course launches, seminars, lectures, and articles — delivered straight from Ahmad. No spam.",
      status: "PUBLISHED",
    },
  });

  // ---- Homepage credentials (child list) --------------------------------
  const credentialLabels = [
    "Arabic & Islamic Studies — Kuwait",
    "PGCE — University of London",
    "Khateeb — Masjid Al-Noor, East London",
    "Ruqyah — practising and teaching since 2009",
  ];

  for (const [index, label] of credentialLabels.entries()) {
    await db.homepageCredential.upsert({
      where: { id: `prod-credential-${index}` },
      update: {},
      create: { id: `prod-credential-${index}`, homepageContentId: "homepage", order: index, label },
    });
  }

  // ---- About content (singleton) + timeline + education -----------------
  const about = await db.aboutContent.upsert({
    where: { id: "about" },
    update: {},
    create: {
      id: "about",
      introText:
        "An Islamic teacher, author, and Khateeb committed to grounded scholarship — carried with the clarity today's seeker needs, without cutting corners on the tradition itself.",
      biography:
        "Ahmad Mohamed Kassa pursued Arabic and Islamic Studies at the Religious Institute in Kuwait, where he received foundational training under respected scholars.\n\nHe also holds a degree in Computer Science and Telecommunications together with a Postgraduate Certificate in Education from the University of London.\n\nAlongside his professional background in academia and consultancy, he serves as Khateeb at Masjid Al-Noor in East London and has authored several books.\n\nSince 2009 he has been actively involved in Ruqyah education and practice, teaching throughout the United Kingdom and internationally.",
      missionText:
        "To share authentic Islamic knowledge through education, research, and practical guidance — in service of the Muslim community.",
      futureVisionText:
        "Books, courses, and seminars are converging toward one goal: a sequenced path of study that takes a sincere beginner from first principles to real depth.",
      badges: ["Khateeb", "Author", "Islamic Speaker", "Ruqyah since 2009"],
    },
  });

  const timelineItems = [
    {
      label: "Foundations",
      title: "Religious Institute, Kuwait",
      description: "Arabic and Islamic Studies, receiving foundational training under respected scholars.",
    },
    {
      label: "Undergraduate",
      title: "Computer Science & Telecommunications",
      description: "Completed a degree preceding his academic and consultancy career.",
    },
    {
      label: "Postgraduate",
      title: "PGCE, University of London",
      description: "Postgraduate Certificate in Education, formalizing a teaching methodology.",
    },
    {
      label: "Career",
      title: "Academia & consultancy",
      description: "Built a professional career alongside his Islamic studies and teaching.",
    },
    {
      label: "Community",
      title: "Khateeb, Masjid Al-Noor",
      description: "Serves as Khateeb at Masjid Al-Noor in East London.",
    },
    {
      label: "2009",
      title: "Ruqyah education & practice",
      description:
        "Actively involved in Ruqyah education and practice, teaching throughout the United Kingdom and internationally.",
    },
    {
      label: "2024",
      title: "Books published",
      description: "The Great Debate released, with further titles on Ruqyah, Aqeedah, and Hajj in progress.",
    },
    {
      label: "Ahead",
      title: "The Academy",
      description: "Structured courses are in active development.",
    },
  ];

  for (const [index, item] of timelineItems.entries()) {
    await db.timelineItem.upsert({
      where: { id: `prod-timeline-${index}` },
      update: {},
      create: { id: `prod-timeline-${index}`, aboutContentId: about.id, order: index, ...item },
    });
  }

  const educationItems = [
    {
      title: "Religious Institute, Kuwait",
      detail: "Arabic and Islamic Studies, with foundational training under respected scholars.",
    },
    {
      title: "Computer Science & Telecommunications",
      detail: "An undergraduate degree preceding his professional academic career.",
    },
    {
      title: "PGCE, University of London",
      detail: "Postgraduate Certificate in Education — formal teacher training.",
    },
  ];

  for (const [index, item] of educationItems.entries()) {
    await db.educationItem.upsert({
      where: { id: `prod-education-${index}` },
      update: {},
      create: { id: `prod-education-${index}`, aboutContentId: about.id, order: index, ...item },
    });
  }

  console.log("Production bootstrap complete:");
  console.log(`  Book:         ${book.title}`);
  console.log(`  Videos:       ${seededVideos.length} khutbahs`);
  console.log(`  Timeline:     ${timelineItems.length} items`);
  console.log(`  Education:    ${educationItems.length} items`);
  console.log(`  Credentials:  ${credentialLabels.length} items`);

  if (ownerPassword) {
    console.log("");
    console.log("================================================================");
    console.log(" OWNER ACCOUNT CREATED — password shown once, never stored in");
    console.log(" plaintext or logged again. Save it now and change it on first login.");
    console.log("================================================================");
    console.log(`  Ahmad Mohamed Kassa   hello@ahmadkassa.com   ${ownerPassword}`);
    console.log("================================================================");
  } else {
    console.log("  Owner account already exists — no new account created.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
