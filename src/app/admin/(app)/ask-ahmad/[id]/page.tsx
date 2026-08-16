import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { QuestionMetaControls } from "@/dashboard/components/question-meta-controls";
import { InternalNotesPanel } from "@/dashboard/components/internal-notes-panel";
import { questionService } from "@/services/question.service";
import { requirePageAccess } from "@/permissions/require-page-access";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  QUESTION_CATEGORY_LABEL as CATEGORY_LABEL,
  QUESTION_STATUS_LABEL as STATUS_LABEL,
  QUESTION_STATUS_TONE as STATUS_TONE,
} from "@/dashboard/ask-ahmad-constants";

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export const metadata = { title: "Question" };

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  await requirePageAccess("questions");
  const { id } = await params;

  const question = await questionService.getWithDetail(id);
  if (!question) notFound();

  if (!question.readAt) {
    await questionService.markRead(id);
    question.readAt = new Date();
  }

  const messages = question.conversation?.messages ?? [];

  return (
    <div className="max-w-6xl space-y-6">
      <Link
        href="/admin/ask-ahmad"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Ask Ahmad
      </Link>

      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-gold-700">{question.referenceNumber}</p>
          <h1 className="mt-1 text-2xl leading-tight sm:text-3xl">
            {question.subject || `Question from ${question.name}`}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge label={CATEGORY_LABEL[question.category]} tone="neutral" />
            <StatusBadge label={STATUS_LABEL[question.status]} tone={STATUS_TONE[question.status]} />
            {question.isPrivate && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="size-3" /> Marked private by visitor
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          <p className="font-medium text-foreground">{question.name}</p>
          <p>{question.email}</p>
          <p className="mt-1">Submitted {formatDate(question.createdAt.toISOString())}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column: conversation timeline + future reply panel */}
        <div className="space-y-6">
          <Card className="border-none p-6 shadow-none ring-1 ring-border">
            <h2 className="text-sm font-medium text-foreground">Conversation</h2>
            <div className="mt-5 space-y-5">
              {messages.map((message) => {
                const isAdmin = message.senderType === "ADMIN";
                return (
                  <div key={message.id} className={cn("flex gap-3", isAdmin && "flex-row-reverse")}>
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback
                        className={isAdmin ? "bg-navy-900 text-xs text-gold-300" : "bg-paper-200 text-xs text-navy-900"}
                      >
                        {isAdmin ? initials(message.senderUser?.name ?? "Admin") : initials(question.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[80%] space-y-1", isAdmin && "items-end text-right")}>
                      <div
                        className={cn(
                          "rounded-lg px-4 py-3 text-sm leading-relaxed",
                          isAdmin ? "bg-navy-900 text-paper-50" : "bg-paper-100 text-foreground/90"
                        )}
                      >
                        {message.message}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin ? message.senderUser?.name ?? "Admin" : question.name} ·{" "}
                        {formatDate(message.createdAt.toISOString())}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border-none p-6 shadow-none ring-1 ring-border">
            <h2 className="text-sm font-medium text-foreground">Reply</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Two-way replies aren&rsquo;t live yet — this panel is reserved for a future update.
            </p>
            <div className="mt-4 space-y-3 opacity-60">
              <Textarea rows={4} placeholder="Replies are coming soon…" disabled />
              <Button type="button" variant="gold" disabled>
                <Send data-icon="inline-start" />
                Send reply
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar: metadata controls + internal notes */}
        <div className="space-y-6">
          <Card className="border-none p-6 shadow-none ring-1 ring-border">
            <h2 className="mb-4 text-sm font-medium text-foreground">Details</h2>
            <QuestionMetaControls question={question} />
          </Card>

          <InternalNotesPanel questionId={question.id} notes={question.notes} />
        </div>
      </div>
    </div>
  );
}
