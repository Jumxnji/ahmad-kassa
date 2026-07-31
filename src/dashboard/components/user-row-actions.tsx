"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { UserFormDialog } from "@/dashboard/components/user-form-dialog";
import { deleteUserAction } from "@/actions/admin/user.actions";
import type { User } from "@/generated/prisma/client";

export function UserRowActions({ user }: { user: User }) {
  const router = useRouter();

  if (user.role === "OWNER") {
    return <UserFormDialog user={user} />;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <UserFormDialog user={user} />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${user.name}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title={`Remove ${user.name}?`}
        description="They'll immediately lose access to the dashboard."
        onConfirm={async () => {
          const result = await deleteUserAction(user.id);
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
