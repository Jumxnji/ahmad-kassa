import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Inbox,
  Mail,
  Users,
  ImageIcon,
  GraduationCap,
  Newspaper,
  CalendarDays,
  UserSquare2,
  CreditCard,
  BarChart3,
  FileText,
} from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { StatCard } from "@/dashboard/components/stat-card";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { bookService } from "@/services/book.service";
import { questionService } from "@/services/question.service";
import { contactService } from "@/services/contact.service";
import { newsletterService } from "@/services/newsletter.service";
import { mediaService } from "@/services/media.service";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Overview" };

const FUTURE_FEATURES = [
  { icon: Newspaper, label: "Articles", description: "Full articles CMS, beyond the current static pages." },
  { icon: GraduationCap, label: "Courses", description: "Structured lessons for the upcoming academy." },
  { icon: CalendarDays, label: "Events", description: "A calendar for seminars and speaking engagements." },
  { icon: UserSquare2, label: "Student Portal", description: "Progress tracking for enrolled students." },
  { icon: CreditCard, label: "Payments", description: "Stripe-powered checkout for direct book sales." },
  { icon: BarChart3, label: "Analytics", description: "Traffic and engagement reporting, in-dashboard." },
] as const;

export default async function AdminOverviewPage() {
  const [
    publishedBooks,
    pendingQuestions,
    unreadMessages,
    subscribers,
    recentQuestions,
    recentMessages,
    recentUploads,
  ] = await Promise.all([
    bookService.countPublished(),
    questionService.countPending(),
    contactService.countUnread(),
    newsletterService.countSubscribed(),
    questionService.list({ status: "PENDING" }),
    contactService.list({ status: "NEW" }),
    mediaService.listRecent(6),
  ]);

  const recentActivity = [
    ...recentQuestions.slice(0, 5).map((q) => ({
      id: q.id,
      href: "/admin/ask-ahmad",
      title: `${q.name} asked a question`,
      meta: q.category.replace("_", " ").toLowerCase(),
      date: q.createdAt,
      badge: "Question",
    })),
    ...recentMessages.slice(0, 5).map((m) => ({
      id: m.id,
      href: "/admin/contact",
      title: `${m.name} sent a message`,
      meta: m.reason.toLowerCase(),
      date: m.createdAt,
      badge: "Message",
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="A quick read on what needs attention across the site."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published books"
          value={publishedBooks}
          icon={BookOpen}
          href="/admin/books"
        />
        <StatCard
          label="Pending questions"
          value={pendingQuestions}
          icon={Inbox}
          href="/admin/ask-ahmad"
          hint={pendingQuestions > 0 ? "Awaiting a reply" : "All caught up"}
        />
        <StatCard
          label="Unread messages"
          value={unreadMessages}
          icon={Mail}
          href="/admin/contact"
          hint={unreadMessages > 0 ? "Needs a look" : "Inbox clear"}
        />
        <StatCard
          label="Newsletter subscribers"
          value={subscribers}
          icon={Users}
          href="/admin/newsletter"
        />
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Recent activity</h2>
        <div className="mt-4">
          {recentActivity.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nothing new"
              description="New questions and messages will show up here as they come in."
            />
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {recentActivity.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper-100"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs capitalize text-muted-foreground">{item.meta}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge label={item.badge} tone="muted" />
                      <span className="text-xs text-muted-foreground">{formatDate(item.date.toISOString())}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Latest uploads</h2>
          <Link href="/admin/media" className="text-sm text-navy-700 hover:underline">
            View library
          </Link>
        </div>
        <div className="mt-4">
          {recentUploads.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No uploads yet"
              description="Images and files you upload will show up here."
            />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {recentUploads.map((item) => {
                const isImage = item.mimeType.startsWith("image/");
                return (
                  <Link
                    key={item.id}
                    href="/admin/media"
                    className="group overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="flex aspect-square items-center justify-center bg-paper-100">
                      {isImage ? (
                        <Image
                          src={item.url}
                          alt={item.altText ?? item.filename}
                          width={120}
                          height={120}
                          className="size-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <FileText className="size-6 text-stone-400" strokeWidth={1.5} />
                      )}
                    </div>
                    <p className="truncate px-2 py-1.5 text-[0.7rem] text-muted-foreground">
                      {item.filename}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Future features</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Already architected behind feature flags — ready to switch on when it&rsquo;s time.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_FEATURES.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-paper-100/40 p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-100 text-stone-400">
                <Icon className="size-4" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <StatusBadge label="Planned" tone="muted" />
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
