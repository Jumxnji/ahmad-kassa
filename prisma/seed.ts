import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  // ---- Owner user ----------------------------------------------------
  const owner = await db.user.upsert({
    where: { email: "hello@ahmadkassa.com" },
    update: {},
    create: {
      name: "Ahmad Mohamed Kassa",
      email: "hello@ahmadkassa.com",
      role: "OWNER",
      status: "ACTIVE",
    },
  });

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
  const book = await db.book.upsert({
    where: { slug: "the-great-debate" },
    update: {},
    create: {
      title: "The Great Debate",
      slug: "the-great-debate",
      excerpt:
        "A clear-eyed examination of the arguments for and against belief in God — weighing philosophy, revelation, and reason without flattening the difficulty of the question.",
      description:
        "The Great Debate examines belief in God with the same rigor Ahmad brings to teaching — walking through the philosophical case for a creator, the problem of evil, and revelation as evidence, before turning to what living with certainty actually looks like.",
      amazonUrl: "https://amazon.com",
      directPurchaseUrl: null, // direct purchase intentionally disabled in V1
      published: true,
      comingSoon: false,
      featured: true,
    },
  });

  // ---- Homepage content (singleton) ------------------------------------
  await db.homepageContent.upsert({
    where: { id: "homepage" },
    update: {},
    create: {
      id: "homepage",
      heroHeadline: "Ahmad Mohamed Kassa",
      heroSubtitle:
        "Helping Muslims strengthen their understanding of Islam through authentic knowledge, thoughtful research and practical guidance.",
      aboutPreviewText:
        "Ahmad Mohamed Kassa pursued Arabic and Islamic Studies at the Religious Institute in Kuwait, where he received foundational training under respected scholars. Alongside a professional background in academia and consultancy, he serves as Khateeb at Masjid Al-Noor in East London and has authored several books.",
      featuredBookId: book.id,
      newsletterText:
        "Book announcements, course launches, seminars, lectures, and articles — delivered straight from Ahmad. No spam.",
    },
  });

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
      description:
        "Arabic and Islamic Studies, receiving foundational training under respected scholars.",
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
      description:
        "The Great Debate released, with further titles on Ruqyah, Aqeedah, and Hajj in progress.",
    },
    {
      label: "Ahead",
      title: "The Academy",
      description: "Structured courses are in active development.",
    },
  ];

  for (const [index, item] of timelineItems.entries()) {
    await db.timelineItem.upsert({
      where: { id: `seed-timeline-${index}` },
      update: {},
      create: { id: `seed-timeline-${index}`, aboutContentId: about.id, order: index, ...item },
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
      where: { id: `seed-education-${index}` },
      update: {},
      create: { id: `seed-education-${index}`, aboutContentId: about.id, order: index, ...item },
    });
  }

  // ---- Sample inbox data, so dashboard tables aren't empty on first run --
  await db.question.upsert({
    where: { id: "seed-question-1" },
    update: {},
    create: {
      id: "seed-question-1",
      name: "Yusuf A.",
      email: "yusuf.example@example.com",
      category: "RUQYAH",
      question:
        "Assalamu alaikum, I've been having trouble sleeping and keep having the same disturbing dream. Could this be linked to the unseen, and if so what's the first practical step?",
      status: "PENDING",
      isPrivate: true,
    },
  });

  await db.contactMessage.upsert({
    where: { id: "seed-contact-1" },
    update: {},
    create: {
      id: "seed-contact-1",
      name: "Amina K.",
      email: "amina.example@example.com",
      reason: "SPEAKING",
      message:
        "We're organizing a seminar in Birmingham this spring and would love to have Ahmad speak on Ruqyah. Could you share available dates and a rough fee?",
      status: "NEW",
    },
  });

  await db.newsletterSubscriber.upsert({
    where: { email: "subscriber.example@example.com" },
    update: {},
    create: { email: "subscriber.example@example.com", language: "en", subscribed: true },
  });

  console.log("Seed complete:");
  console.log(`  Owner user:   ${owner.email}`);
  console.log(`  Book:         ${book.title}`);
  console.log(`  Timeline:     ${timelineItems.length} items`);
  console.log(`  Education:    ${educationItems.length} items`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
