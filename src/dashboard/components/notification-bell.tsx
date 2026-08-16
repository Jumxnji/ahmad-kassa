"use client";

import Link from "next/link";
import { Bell, Inbox, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import type { NotificationSummary } from "@/services/notification.service";

export function NotificationBell({ summary }: { summary: NotificationSummary }) {
  const hasAny = summary.total > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${hasAny ? `, ${summary.total} unread` : ""}`}>
          <Bell className="size-4.5" strokeWidth={1.75} />
          {hasAny && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[0.6rem] font-medium text-white">
              {summary.total > 9 ? "9+" : summary.total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between font-normal">
          <span className="text-sm font-medium text-foreground">Notifications</span>
          {hasAny && <Badge variant="secondary" className="border-none bg-paper-100 text-stone-600">{summary.total} unread</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasAny ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">You&rsquo;re all caught up.</p>
        ) : (
          <>
            {summary.recentQuestions.map((q) => (
              <DropdownMenuItem key={`q-${q.id}`} asChild>
                <Link href={`/admin/ask-ahmad/${q.id}`} className="flex items-start gap-2.5">
                  <Inbox className="mt-0.5 size-3.5 shrink-0 text-gold-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">New question from {q.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {q.referenceNumber} · {formatDate(q.createdAt.toISOString())}
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
            {summary.recentMessages.map((m) => (
              <DropdownMenuItem key={`m-${m.id}`} asChild>
                <Link href="/admin/contact" className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 size-3.5 shrink-0 text-gold-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">New message from {m.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{m.subject}</span>
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
