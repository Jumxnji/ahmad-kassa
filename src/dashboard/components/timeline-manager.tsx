"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import {
  addTimelineItemAction,
  removeTimelineItemAction,
  updateTimelineItemAction,
} from "@/actions/admin/about.actions";
import { timelineItemFormSchema, type TimelineItemFormInput } from "@/validators/about.validator";
import type { TimelineItem } from "@/generated/prisma/client";

function ItemDialog({
  item,
  nextOrder,
  onSaved,
}: {
  item?: TimelineItem;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TimelineItemFormInput>({
    resolver: zodResolver(timelineItemFormSchema),
    defaultValues: {
      label: item?.label ?? "",
      title: item?.title ?? "",
      description: item?.description ?? "",
      order: item?.order ?? nextOrder,
    },
  });

  function onSubmit(values: TimelineItemFormInput) {
    startTransition(async () => {
      const result = item
        ? await updateTimelineItemAction(item.id, values)
        : await addTimelineItemAction(values);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        form.reset();
        onSaved();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon-sm" aria-label="Edit entry">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Plus data-icon="inline-start" />
            Add entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit timeline entry" : "New timeline entry"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="2009, Foundations, Career…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="gold" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function TimelineManager({ items }: { items: TimelineItem[] }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-border p-4"
          >
            <GripVertical className="mt-0.5 size-4 shrink-0 text-stone-300" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-eyebrow">{item.label}</p>
              <p className="mt-1 font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <ItemDialog item={item} nextOrder={item.order} onSaved={router.refresh} />
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon-sm" aria-label="Delete entry">
                    <Trash2 className="size-3.5" />
                  </Button>
                }
                title="Delete this entry?"
                description="This timeline entry will be removed from the About page."
                onConfirm={async () => {
                  const result = await removeTimelineItemAction(item.id);
                  if (result.success) {
                    toast.success(result.message);
                    router.refresh();
                  } else {
                    toast.error(result.message);
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <ItemDialog nextOrder={items.length} onSaved={router.refresh} />
    </div>
  );
}
