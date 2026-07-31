"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { deleteBookAction, duplicateBookAction } from "@/actions/admin/book.actions";
import type { $Enums } from "@/generated/prisma/client";

interface BookRowActionsProps {
  id: string;
  title: string;
  slug: string;
  status: $Enums.BookStatus;
}

export function BookRowActions({ id, title, slug, status }: BookRowActionsProps) {
  const router = useRouter();
  const isPublic = status === "PUBLISHED" || status === "COMING_SOON";

  async function handleDuplicate() {
    const result = await duplicateBookAction(id);
    if (result.success) {
      toast.success(result.message);
      router.push(`/admin/books/${result.data.id}`);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {isPublic && (
        <Button asChild variant="ghost" size="icon-sm" aria-label={`View ${title} on the live site`}>
          <a href={`/books/${slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
          </a>
        </Button>
      )}
      <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${title}`}>
        <Link href={`/admin/books/${id}`}>
          <Pencil className="size-3.5" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={`Duplicate ${title}`} onClick={handleDuplicate}>
        <Copy className="size-3.5" />
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
