"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import {
  deleteSubscriberAction,
  setSubscriberStatusAction,
} from "@/actions/admin/newsletter.actions";
import type { NewsletterSubscriber } from "@/generated/prisma/client";

export function SubscriberRowActions({ subscriber }: { subscriber: NewsletterSubscriber }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle(next: boolean) {
    startTransition(async () => {
      const result = await setSubscriberStatusAction(subscriber.id, next);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Switch
        checked={subscriber.subscribed}
        onCheckedChange={toggle}
        disabled={isPending}
        aria-label={subscriber.subscribed ? "Unsubscribe" : "Resubscribe"}
      />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${subscriber.email}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title="Remove this subscriber?"
        description="This can't be undone."
        onConfirm={async () => {
          const result = await deleteSubscriberAction(subscriber.id);
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
