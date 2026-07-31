"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { updateContactMessageAction } from "@/actions/admin/contact.actions";
import { formatDate } from "@/lib/format";
import type { ContactMessage, $Enums } from "@/generated/prisma/client";

const STATUS_TONE = { NEW: "warning", READ: "neutral", ARCHIVED: "muted" } as const;

export function ContactDetailSheet({ message }: { message: ContactMessage }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(message.status);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(next: $Enums.ContactStatus) {
    setStatus(next);
    startTransition(async () => {
      const result = await updateContactMessageAction(message.id, { status: next });
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && message.status === "NEW") handleStatusChange("READ");
      }}
    >
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`View message from ${message.name}`}>
          <Eye className="size-3.5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{message.name}</SheetTitle>
          <SheetDescription>{message.email}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={message.reason} tone="neutral" />
            <StatusBadge label={status} tone={STATUS_TONE[status]} />
            <span className="ml-auto text-xs text-muted-foreground">
              {formatDate(message.createdAt.toISOString())}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-paper-100/60 p-4">
            <p className="text-sm leading-relaxed text-foreground/90">{message.message}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Status</p>
            <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="px-0">
            <Button asChild variant="outline">
              <a href={`mailto:${message.email}`}>Reply by email</a>
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
