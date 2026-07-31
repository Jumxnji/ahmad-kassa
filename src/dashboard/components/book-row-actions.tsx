"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { deleteBookAction } from "@/actions/admin/book.actions";

export function BookRowActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${title}`}>
        <Link href={`/admin/books/${id}`}>
          <Pencil className="size-3.5" />
        </Link>
      </Button>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${title}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title={`Delete "${title}"?`}
        description="This can't be undone. The book will be removed from the site immediately."
        onConfirm={async () => {
          const result = await deleteBookAction(id);
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
