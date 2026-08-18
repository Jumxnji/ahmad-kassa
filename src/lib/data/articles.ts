import type { Article, ArticleBlock } from "@/types/content";
import { AHMAD } from "@/lib/data/authors";

function blocks(entries: readonly ArticleBlock[]): readonly ArticleBlock[] {
  return entries;
}

/**
 * Draft editorial catalog — no CMS yet, and none of these ten pieces
 * has been confirmed for real publication. `status: "draft"` keeps
 * every one of them out of every public surface — the `/articles`
 * index, individual `/articles/[slug]` routes, the sitemap, and
 * related-reading — via the `status === "published"` filter in
 * `getAllArticles()` below, which every other getter in this file is
 * built on. The drafts themselves are preserved, not deleted, for
 * whenever real writing is ready. Flip an entry's `status` to
 * `"published"` (with an accurate `publishedAt`) only once it is
 * genuinely ready to be public — never to fill out an empty page. See
 * `docs/PROJECT_MEMORY.md`'s "Content truth" note.
 *
 * `content` blocks power the long-form reading page (headings become
 * TOC anchors); list pages only need the metadata fields above them.
 */
export const ARTICLES: readonly Article[] = [
  {
    id: "article-understanding-tawakkul",
    slug: "understanding-tawakkul",
    title: "Understanding Tawakkul",
    excerpt:
      "Reliance on God is not passivity. It's the discipline of acting fully while releasing the outcome — and it changes how anxiety works.",
    status: "draft",
    author: AHMAD,
    category: "Aqeedah",
    readingTimeMinutes: 6,
    tags: ["tawakkul", "trust", "anxiety"],
    featured: true,
    publishedAt: "2026-06-18",
    content: blocks([
      {
        type: "paragraph",
        text: "Tawakkul is often translated as “trust in God,” which is accurate but incomplete. It is trust that follows effort, not trust instead of it — a distinction the tradition insists on and that modern anxiety makes easy to forget.",
      },
      { type: "heading", id: "the-tie-the-camel-principle", text: "The “tie the camel” principle" },
      {
        type: "paragraph",
        text: "The well-known instruction to tie your camel and then trust God captures the whole architecture: reasonable means are not a lack of faith, they are part of it. Tawakkul begins where competent effort ends, not before it.",
      },
      {
        type: "paragraph",
        text: "This reframes a common anxious pattern — the belief that if I just plan enough, worry enough, control enough, the outcome is secured. Tawakkul says: do the planning that is actually yours to do, then hand over what was never yours to control in the first place.",
      },
      { type: "heading", id: "what-changes-in-practice", text: "What changes in practice" },
      {
        type: "paragraph",
        text: "Practically, this looks like finishing the parts of a decision within your control — the application, the conversation, the treatment plan — and then noticing the mental loop that tries to keep working after the work is done. That loop is not diligence. It is an attempt to do God's part.",
      },
      {
        type: "quote",
        text: "And whoever relies upon God — then He is sufficient for him.",
        attribution: "Qur'an 65:3",
      },
      {
        type: "paragraph",
        text: "Tawakkul, held this way, is not resignation. It is the calm that becomes available once you've stopped trying to hold what was never yours to hold.",
      },
    ]),
    seo: {
      title: "Understanding Tawakkul — Ahmad Mohamed Kassa",
      description: "Reliance on God is not passivity. A working definition of Tawakkul.",
    },
  },
  {
    id: "article-marriage-and-mercy",
    slug: "marriage-and-mercy",
    title: "Marriage and Mercy",
    excerpt:
      "The Qur'an pairs marriage with tranquility and mercy, not romance. That ordering says something about what actually sustains a household.",
    status: "draft",
    author: AHMAD,
    category: "Marriage & Family",
    readingTimeMinutes: 7,
    tags: ["marriage", "mercy", "family"],
    featured: true,
    publishedAt: "2026-06-02",
    content: blocks([
      {
        type: "paragraph",
        text: "Surah Ar-Rum describes spouses as a source of tranquility, and the bond between them as built on mawaddah and rahmah — affection and mercy. Mercy is the less romantic word, and the more load-bearing one.",
      },
      { type: "heading", id: "why-mercy-comes-first", text: "Why mercy comes first" },
      {
        type: "paragraph",
        text: "Affection fluctuates with circumstance, health, and mood. Mercy is a chosen posture toward someone's shortcomings — a decision to extend the same patience you'd want extended to you, on the days affection alone wouldn't get you there.",
      },
      {
        type: "paragraph",
        text: "Couples who describe their marriage as strong rarely describe an absence of friction. They describe a habit of mercy that outlasts the friction — covering faults, assuming good intent, and repairing quickly rather than keeping score.",
      },
      { type: "heading", id: "a-practical-marker", text: "A practical marker" },
      {
        type: "paragraph",
        text: "One useful test: does mercy show up first, or does it show up only after an apology is extracted? The first is the sunnah pattern. The second is a transaction dressed as a marriage.",
      },
      {
        type: "quote",
        text: "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He placed between you affection and mercy.",
        attribution: "Qur'an 30:21",
      },
    ]),
    seo: {
      title: "Marriage and Mercy — Ahmad Mohamed Kassa",
      description: "Why the Qur'an pairs marriage with mercy rather than romance alone.",
    },
  },
  {
    id: "article-purpose-of-ruqyah",
    slug: "the-purpose-of-ruqyah",
    title: "The Purpose of Ruqyah",
    excerpt:
      "Ruqyah is a means of treatment grounded in revelation, not a performance. Two decades of practice have made the distinction clearer, not murkier.",
    status: "draft",
    author: AHMAD,
    category: "Ruqyah",
    readingTimeMinutes: 8,
    tags: ["ruqyah", "healing", "aqeedah"],
    featured: true,
    publishedAt: "2026-05-14",
    content: blocks([
      {
        type: "paragraph",
        text: "Ruqyah is recitation used as a means of seeking cure — from the Qur'an and authentic supplications, applied with the same expectation of divine permission that governs every other means in Islam, medicine included.",
      },
      { type: "heading", id: "means-not-magic", text: "A means, not magic" },
      {
        type: "paragraph",
        text: "The confusion around Ruqyah usually comes from treating it as a guaranteed mechanism rather than a permitted means. Like medicine, its effect is real but not automatic, and it operates entirely within God's decree — not as leverage over it.",
      },
      {
        type: "paragraph",
        text: "This is why the earliest scholars were cautious about anyone who spoke of Ruqyah with certainty of outcome, or who added rituals with no basis in text. The practice stays authentic only when it stays this modest.",
      },
      { type: "heading", id: "who-it-is-for", text: "Who it is for" },
      {
        type: "paragraph",
        text: "In practice, most who seek Ruqyah are dealing with symptoms that sit at the intersection of the spiritual and the psychological — unexplained fear, disturbed sleep, a sense of being unwell without a clear cause. A sound approach never substitutes for medical care; it sits alongside it.",
      },
      {
        type: "quote",
        text: "There is no disease that God has sent down except that He has also sent down its cure.",
        attribution: "Sahih al-Bukhari",
      },
    ]),
    seo: {
      title: "The Purpose of Ruqyah — Ahmad Mohamed Kassa",
      description: "Ruqyah as a permitted means of treatment, not a performance.",
    },
  },
  {
    id: "article-signs-of-sincerity",
    slug: "signs-of-sincerity",
    title: "Signs of Sincerity",
    excerpt:
      "Ikhlas is invisible by definition, which makes it tempting to stop examining it. A few honest questions make it visible enough to work on.",
    status: "draft",
    author: AHMAD,
    category: "Spirituality",
    readingTimeMinutes: 5,
    tags: ["ikhlas", "sincerity", "heart"],
    featured: true,
    publishedAt: "2026-04-22",
    content: blocks([
      {
        type: "paragraph",
        text: "Sincerity can't be observed directly — not by others, and often not even by the person acting. That's precisely why the tradition gives us indirect signs to check ourselves against, rather than asking us to simply feel confident about our own hearts.",
      },
      { type: "heading", id: "does-it-survive-obscurity", text: "Does it survive obscurity?" },
      {
        type: "paragraph",
        text: "One reliable marker: does the act still get done, with the same care, when no one will ever know it happened? Sincerity tends to be indifferent to an audience. Its opposite needs one.",
      },
      { type: "heading", id: "does-praise-unsettle-you", text: "Does praise unsettle you?" },
      {
        type: "paragraph",
        text: "A second marker is the reaction to being praised for something done for God. Sincerity feels a mild discomfort — a sense that the credit is misplaced — rather than a quiet satisfaction that people finally noticed.",
      },
      {
        type: "paragraph",
        text: "Neither test produces certainty. But checking against them regularly is itself a form of the sincerity it's testing for — which is, in the end, most of what's asked of us.",
      },
    ]),
    seo: {
      title: "Signs of Sincerity — Ahmad Mohamed Kassa",
      description: "A few honest questions for examining Ikhlas in everyday actions.",
    },
  },
  {
    id: "article-weight-of-intention",
    slug: "the-weight-of-intention",
    title: "The Weight of Intention",
    excerpt:
      "Actions are judged by intentions — a hadith so familiar it's easy to stop noticing how much work it's actually doing.",
    status: "draft",
    author: AHMAD,
    category: "Aqeedah",
    readingTimeMinutes: 5,
    tags: ["niyyah", "intention"],
    publishedAt: "2026-04-02",
    content: blocks([
      {
        type: "paragraph",
        text: "“Actions are but by intentions” opens the most quoted hadith collections for a reason: it relocates the weight of a deed from its visible form to something no one else can see.",
      },
      { type: "heading", id: "identical-acts-different-weight", text: "Identical acts, different weight" },
      {
        type: "paragraph",
        text: "Two people can perform the same charitable act and walk away with entirely different outcomes before God, because the act was never the whole story. Intention is not a footnote to the deed — it is the deed's actual substance.",
      },
      {
        type: "paragraph",
        text: "This is freeing rather than burdensome once it's understood correctly: it means the ordinary, unnoticed parts of a day — work, rest, care for a household — can carry the same weight as visibly religious acts, if the intention behind them is oriented rightly.",
      },
    ]),
    seo: {
      title: "The Weight of Intention — Ahmad Mohamed Kassa",
      description: "What the hadith on intentions is actually doing.",
    },
  },
  {
    id: "article-grief-and-gratitude",
    slug: "grief-and-gratitude",
    title: "Grief and Gratitude",
    excerpt:
      "The two aren't opposites. Islam asks for both at once, which is harder — and more honest — than asking for either alone.",
    status: "draft",
    author: AHMAD,
    category: "Spirituality",
    readingTimeMinutes: 6,
    tags: ["grief", "sabr", "gratitude"],
    publishedAt: "2026-03-11",
    content: blocks([
      {
        type: "paragraph",
        text: "Sabr is frequently mistranslated as suppression — the idea that patience means not feeling the loss. The Prophet's own example with grief, peace be upon him, makes clear that's not the model on offer.",
      },
      { type: "heading", id: "the-prophets-tears", text: "The Prophet's own tears" },
      {
        type: "paragraph",
        text: "At his son Ibrahim's death, the Prophet — peace be upon him — wept openly and was asked about it, given his own teaching on patience. His answer was that the eye weeps and the heart grieves, but the tongue says only what pleases God.",
      },
      {
        type: "paragraph",
        text: "That single answer holds grief and submission together without asking either to cancel the other out — which is a more demanding, and more human, standard than stoicism.",
      },
    ]),
    seo: {
      title: "Grief and Gratitude — Ahmad Mohamed Kassa",
      description: "What the Prophet's example teaches about grieving honestly.",
    },
  },
  {
    id: "article-why-we-doubt",
    slug: "why-we-doubt",
    title: "Why We Doubt",
    excerpt:
      "Doubt is not automatically a crisis of faith. Sometimes it's just the mind doing its job, and the response matters more than the doubt itself.",
    status: "draft",
    author: AHMAD,
    category: "Aqeedah",
    readingTimeMinutes: 7,
    tags: ["doubt", "waswas", "certainty"],
    publishedAt: "2026-02-19",
    content: blocks([
      {
        type: "paragraph",
        text: "The companions themselves reported intrusive doubts so distressing they hesitated to voice them — and were told that voicing that distress was itself a sign of faith, not its absence.",
      },
      { type: "heading", id: "the-companions-question", text: "The companions' question" },
      {
        type: "paragraph",
        text: "Their concern was answered with a single instruction: seek refuge and stop entertaining the thought further. Not because the thought was answerable in that moment, but because engaging it on its own terms was the actual trap.",
      },
      {
        type: "paragraph",
        text: "That distinction — between a doubt worth examining and a whisper designed only to loop — is most of the practical skill involved. Not every uninvited thought deserves a rebuttal.",
      },
    ]),
    seo: {
      title: "Why We Doubt — Ahmad Mohamed Kassa",
      description: "On intrusive religious doubt and how the companions were taught to meet it.",
    },
  },
  {
    id: "article-quiet-discipline-of-dua",
    slug: "the-quiet-discipline-of-dua",
    title: "The Quiet Discipline of Dua",
    excerpt:
      "Dua is treated as a last resort by habit, when the texts describe it as the whole relationship — not the emergency exit from it.",
    status: "draft",
    author: AHMAD,
    category: "Fiqh",
    readingTimeMinutes: 4,
    tags: ["dua", "worship"],
    publishedAt: "2026-01-25",
    content: blocks([
      {
        type: "paragraph",
        text: "“Dua is worship” is stated plainly in hadith, yet it's commonly treated as a last resort — something reached for once other options are exhausted, rather than the ongoing practice the texts describe.",
      },
      { type: "heading", id: "asking-as-worship-not-weakness", text: "Asking as worship, not weakness" },
      {
        type: "paragraph",
        text: "Framed correctly, constant asking is not a sign of a life going badly. It is the shape ordinary reliance is supposed to take — for the significant and the mundane alike, without needing a crisis to justify it.",
      },
    ]),
    seo: {
      title: "The Quiet Discipline of Dua — Ahmad Mohamed Kassa",
      description: "Dua as ongoing worship rather than a last resort.",
    },
  },
  {
    id: "article-preparing-for-hajj",
    slug: "preparing-for-hajj",
    title: "Preparing for Hajj",
    excerpt:
      "The rites matter, but so does the state you arrive in. What to settle before you travel, and what to expect once you're there.",
    status: "draft",
    author: AHMAD,
    category: "Hajj & Umrah",
    readingTimeMinutes: 7,
    tags: ["hajj", "preparation", "worship"],
    publishedAt: "2026-07-08",
    content: blocks([
      {
        type: "paragraph",
        text: "Most guidance on Hajj focuses on the rites themselves — where to stand, what to recite, when to move. That matters, but it isn't where preparation should start.",
      },
      { type: "heading", id: "settle-accounts-first", text: "Settle accounts first" },
      {
        type: "paragraph",
        text: "The classical advice is to repay debts, return anything held in trust, and seek forgiveness from anyone wronged before travelling — treating the journey as one that might not have a return, not out of morbidity, but out of seriousness.",
      },
      {
        type: "paragraph",
        text: "Practically, this also removes distraction. A traveller who has settled their affairs arrives at the rites with a lighter heart, not a mental list of unresolved obligations back home.",
      },
      { type: "heading", id: "expect-difficulty", text: "Expect difficulty, plan for it" },
      {
        type: "paragraph",
        text: "Crowds, heat, and exhaustion are not signs that something has gone wrong — they are close to the default experience. Pilgrims who expect ease going in tend to struggle more than those who expect hardship and are pleasantly surprised.",
      },
      {
        type: "paragraph",
        text: "The rites themselves are learnable from any reliable guide. What's harder to teach — and worth deliberate preparation — is the patience the journey asks for.",
      },
    ]),
    seo: {
      title: "Preparing for Hajj — Ahmad Mohamed Kassa",
      description: "What to settle before travelling for Hajj, and what to expect once there.",
    },
  },
  {
    id: "article-protecting-the-heart",
    slug: "protecting-the-heart",
    title: "Protecting the Heart",
    excerpt:
      "The heart is described as the seat of belief and easily diseased. What the tradition actually prescribes for guarding it, in plain terms.",
    status: "draft",
    author: AHMAD,
    category: "Spirituality",
    readingTimeMinutes: 6,
    tags: ["qalb", "heart", "spirituality"],
    publishedAt: "2026-07-22",
    content: blocks([
      {
        type: "paragraph",
        text: "The heart is described in the sources as the one part of the body whose soundness determines the soundness of everything else — yet it's rarely given the same deliberate care as outward acts of worship.",
      },
      { type: "heading", id: "what-a-diseased-heart-looks-like", text: "What a diseased heart looks like" },
      {
        type: "paragraph",
        text: "Not dramatic sin, usually. More often it's a slow numbness — recitation that no longer moves anything, worship performed out of habit rather than presence, envy or resentment left unexamined because they don't feel urgent.",
      },
      { type: "heading", id: "three-ordinary-safeguards", text: "Three ordinary safeguards" },
      {
        type: "paragraph",
        text: "The classical prescriptions are unglamorous: regular remembrance of God, honest self-examination at the end of each day, and keeping company that reminds you of your obligations rather than lets you forget them.",
      },
      {
        type: "paragraph",
        text: "None of these are dramatic interventions. That's the point — a heart is rarely lost in one decisive moment. It drifts, in small increments, and is protected the same way.",
      },
    ]),
    seo: {
      title: "Protecting the Heart — Ahmad Mohamed Kassa",
      description: "What the tradition prescribes for guarding the heart, in plain terms.",
    },
  },
] as const;

export const ARTICLES_PER_PAGE = 6;

/** The only public-facing article list — every other getter below is built on this. */
export function getAllArticles(): readonly Article[] {
  return ARTICLES.filter((article) => article.status === "published");
}

export function getFeaturedArticles(limit = 4): readonly Article[] {
  const published = getAllArticles();
  const featured = published.filter((article) => article.featured);
  return (featured.length ? featured : published).slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): readonly Article[] {
  const current = getArticleBySlug(slug);
  const pool = getAllArticles().filter((article) => article.slug !== slug);
  if (!current?.category) return pool.slice(0, limit);

  const sameCategory = pool.filter((article) => article.category === current.category);
  const rest = pool.filter((article) => article.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getArticlesPage(page: number): {
  readonly items: readonly Article[];
  readonly totalPages: number;
  readonly currentPage: number;
} {
  const published = getAllArticles();
  const totalPages = Math.max(1, Math.ceil(published.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  return {
    items: published.slice(start, start + ARTICLES_PER_PAGE),
    totalPages,
    currentPage,
  };
}
