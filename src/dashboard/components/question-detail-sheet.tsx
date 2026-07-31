"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, Flag, Lock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { updateQuestionAction, toggleQuestionFlagAction } from "@/actions/admin/question.actions";
import { updateQuestionSchema, type UpdateQuestionInput } from "@/validators/question.validator";
import { formatDate } from "@/lib/format";
import type { Question } from "@/generated/prisma/client";

const STATUS_TONE = {
  PENDING: "warning",
  ANSWERED: "success",
  ARCHIVED: "muted",
} as const;

export function QuestionDetailSheet({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const [flagged, setFlagged] = useState(question.flagged);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFlagPending, startFlagTransition] = useTransition();

  function toggleFlag() {
    const next = !flagged;
    setFlagged(next);
    startFlagTransition(async () => {
      const result = await toggleQuestionFlagAction(question.id, next);
      if (result.success) {
        router.refresh();
      } else {
        setFlagged(!next);
        toast.error(result.message);
      }
    });
  }

  const form = useForm<UpdateQuestionInput>({
    resolver: zodResolver(updateQuestionSchema),
    defaultValues: {
      status: question.status,
      answer: question.answer ?? "",
      isPrivate: question.isPrivate,
    },
  });

  function onSubmit(values: UpdateQuestionInput) {
    startTransition(async () => {
      const result = await updateQuestionAction(question.id, values);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`View question from ${question.name}`}>
          <Eye className="size-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{question.name}</SheetTitle>
          <SheetDescription>{question.email}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={question.category.replace("_", " ")} tone="neutral" />
            <StatusBadge label={question.status} tone={STATUS_TONE[question.status]} />
            {question.isPrivate && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="size-3" /> Private
              </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {formatDate(question.createdAt.toISOString())}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFlagPending}
            onClick={toggleFlag}
            className={flagged ? "border-destructive/40 text-destructive hover:text-destructive" : ""}
          >
            <Flag data-icon="inline-start" className={flagged ? "fill-current" : ""} />
            {flagged ? "Flagged — remove" : "Flag for follow-up"}
          </Button>

          <div className="rounded-lg border border-border bg-paper-100/60 p-4">
            <p className="text-sm leading-relaxed text-foreground/90">{question.question}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ANSWERED">Answered</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reply (private notes / future emailed reply)</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Write a reply…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="px-0">
                <Button type="submit" variant="gold" disabled={isPending}>
                  {isPending ? "Saving…" : "Save"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
