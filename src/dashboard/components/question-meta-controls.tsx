"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Flag, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import {
  updateQuestionAction,
  archiveQuestionAction,
  markQuestionReadAction,
  markQuestionUnreadAction,
  deleteQuestionAction,
  toggleQuestionFlagAction,
} from "@/actions/admin/question.actions";
import type { $Enums, Question } from "@/generated/prisma/client";

const STATUS_OPTIONS: { value: $Enums.QuestionStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "WAITING", label: "Waiting" },
  { value: "ANSWERED", label: "Answered" },
  { value: "CLOSED", label: "Closed" },
  { value: "ARCHIVED", label: "Archived" },
];

const PRIORITY_OPTIONS: { value: $Enums.QuestionPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export function QuestionMetaControls({ question }: { question: Question }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: $Enums.QuestionStatus) {
    startTransition(async () => {
      const result = await updateQuestionAction(question.id, { status });
      if (result.success) router.refresh();
      else toast.error(result.message);
    });
  }

  function handlePriorityChange(priority: $Enums.QuestionPriority) {
    startTransition(async () => {
      const result = await updateQuestionAction(question.id, { priority });
      if (result.success) router.refresh();
      else toast.error(result.message);
    });
  }

  function handleToggleRead() {
    startTransition(async () => {
      const action = question.readAt ? markQuestionUnreadAction : markQuestionReadAction;
      const result = await action(question.id);
      if (result.success) router.refresh();
      else toast.error(result.message);
    });
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await archiveQuestionAction(question.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleToggleFlag() {
    startTransition(async () => {
      const result = await toggleQuestionFlagAction(question.id, !question.flagged);
      if (result.success) router.refresh();
      else toast.error(result.message);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={question.status} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select value={question.priority} onValueChange={handlePriorityChange} disabled={isPending}>
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggleRead}>
          <MailOpen data-icon="inline-start" />
          {question.readAt ? "Mark as unread" : "Mark as read"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleToggleFlag}
          className={question.flagged ? "border-destructive/40 text-destructive hover:text-destructive" : ""}
        >
          <Flag data-icon="inline-start" className={question.flagged ? "fill-current" : ""} />
          {question.flagged ? "Flagged — remove" : "Flag for follow-up"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending || question.status === "ARCHIVED"}
          onClick={handleArchive}
        >
          <Archive data-icon="inline-start" />
          Archive
        </Button>
        <ConfirmDialog
          trigger={
            <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          }
          title="Delete this question?"
          description="This can't be undone — the question, its conversation, and any internal notes will all be removed."
          confirmLabel="Delete"
          onConfirm={async () => {
            const result = await deleteQuestionAction(question.id);
            if (result.success) {
              toast.success(result.message);
              router.push("/admin/ask-ahmad");
              router.refresh();
            } else {
              toast.error(result.message);
            }
          }}
        />
      </div>
    </div>
  );
}
