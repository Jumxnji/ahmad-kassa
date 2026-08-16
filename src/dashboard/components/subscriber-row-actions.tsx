"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import {
  unsubscribeSubscriberAction,
  resubscribeSubscriberAction,
  suppressSubscriberAction,
  deleteSubscriberAction,
} from "@/actions/admin/newsletter.actions";
import type { NewsletterSubscriber } from "@/generated/prisma/client";

const NEVER_REACTIVATE = new Set(["SUPPRESSED", "BOUNCED", "COMPLAINED"]);

export function SubscriberRowActions({ subscriber }: { subscriber: NewsletterSubscriber }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  async function runAwaited(action: () => Promise<{ success: boolean; message: string }>) {
    const result = await action();
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  const canReactivate = subscriber.status === "UNSUBSCRIBED";
  const canSuppress = !NEVER_REACTIVATE.has(subscriber.status);
  const canUnsubscribe = subscriber.status === "ACTIVE" || subscriber.status === "PENDING";

  return (
    <div className="flex items-center justify-end gap-1.5">
      {canReactivate && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => run(() => resubscribeSubscriberAction(subscriber.id))}
        >
          Resubscribe
        </Button>
      )}
      {canUnsubscribe && (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => run(() => unsubscribeSubscriberAction(subscriber.id))}
        >
          Unsubscribe
        </Button>
      )}
      {canSuppress && (
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={`Suppress ${subscriber.email}`} disabled={isPending}>
              <ShieldOff className="size-3.5" />
            </Button>
          }
          title="Suppress this address?"
          description="Suppressed addresses can never be auto-reactivated — only used for addresses that should never receive mail again."
          confirmLabel="Suppress"
          onConfirm={() => runAwaited(() => suppressSubscriberAction(subscriber.id))}
        />
      )}
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${subscriber.email}`} disabled={isPending}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title="Remove this subscriber?"
        description="This permanently deletes their record, including consent history. This can't be undone."
        onConfirm={() => runAwaited(() => deleteSubscriberAction(subscriber.id))}
      />
    </div>
  );
}
