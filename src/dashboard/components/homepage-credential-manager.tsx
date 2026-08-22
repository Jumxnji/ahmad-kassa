"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  addHomepageCredentialAction,
  moveHomepageCredentialAction,
  removeHomepageCredentialAction,
  updateHomepageCredentialAction,
} from "@/actions/admin/homepage.actions";
import {
  homepageCredentialFormSchema,
  type HomepageCredentialFormInput,
} from "@/validators/homepage.validator";
import { MAX_HOMEPAGE_CREDENTIALS } from "@/schemas/homepage.schema";
import type { HomepageCredential } from "@/generated/prisma/client";

function ItemDialog({
  item,
  nextOrder,
  onSaved,
}: {
  item?: HomepageCredential;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<HomepageCredentialFormInput>({
    resolver: zodResolver(homepageCredentialFormSchema),
    defaultValues: {
      label: item?.label ?? "",
      order: item?.order ?? nextOrder,
    },
  });

  function onSubmit(values: HomepageCredentialFormInput) {
    startTransition(async () => {
      const result = item
        ? await updateHomepageCredentialAction(item.id, values)
        : await addHomepageCredentialAction(values);
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
          <Button variant="ghost" size="icon-sm" aria-label="Edit credential">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Plus data-icon="inline-start" />
            Add credential
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit credential" : "New credential"}</DialogTitle>
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
                    <Input placeholder="Arabic & Islamic Studies — Kuwait" {...field} />
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

export function HomepageCredentialManager({ items }: { items: HomepageCredential[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const atCap = items.length >= MAX_HOMEPAGE_CREDENTIALS;

  function handleMove(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveHomepageCredentialAction(id, direction);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
            <div className="flex shrink-0 flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Move up"
                disabled={index === 0 || isPending}
                onClick={() => handleMove(item.id, "up")}
              >
                <ArrowUp className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Move down"
                disabled={index === items.length - 1 || isPending}
                onClick={() => handleMove(item.id, "down")}
              >
                <ArrowDown className="size-3.5" />
              </Button>
            </div>
            <p className="min-w-0 flex-1 font-medium text-foreground">{item.label}</p>
            <div className="flex shrink-0 items-center gap-1">
              <ItemDialog item={item} nextOrder={item.order} onSaved={router.refresh} />
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="icon-sm" aria-label="Delete credential">
                    <Trash2 className="size-3.5" />
                  </Button>
                }
                title="Delete this credential?"
                description="This entry will be removed from the About Preview section on the homepage."
                onConfirm={async () => {
                  const result = await removeHomepageCredentialAction(item.id);
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
      {atCap ? (
        <p className="text-xs text-muted-foreground">
          You&rsquo;ve reached the {MAX_HOMEPAGE_CREDENTIALS}-credential limit — remove one to add another.
        </p>
      ) : (
        <ItemDialog nextOrder={items.length} onSaved={router.refresh} />
      )}
    </div>
  );
}
