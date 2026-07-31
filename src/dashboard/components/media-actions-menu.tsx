"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
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
import { renameMediaAction, deleteMediaAction } from "@/actions/admin/media.actions";
import { renameMediaSchema, type RenameMediaInput } from "@/validators/media.validator";
import { cn } from "@/lib/utils";
import type { Media } from "@/generated/prisma/client";

function RenameDialog({ media }: { media: Media }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RenameMediaInput>({
    resolver: zodResolver(renameMediaSchema),
    defaultValues: { filename: media.filename },
  });

  function onSubmit(values: RenameMediaInput) {
    startTransition(async () => {
      const result = await renameMediaAction(media.id, values);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Rename ${media.filename}`}>
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input {...field} />
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

export function MediaActionsMenu({ media, className }: { media: Media; className?: string }) {
  const router = useRouter();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <RenameDialog media={media} />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${media.filename}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title={`Delete "${media.filename}"?`}
        description="This can't be undone. Remove it from anything using it first."
        onConfirm={async () => {
          const result = await deleteMediaAction(media.id);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
          } else {
            toast.error(result.message);
          }
        }}
      />
    </div>
  );
}
