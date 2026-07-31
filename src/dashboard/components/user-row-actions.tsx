"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { UserFormDialog } from "@/dashboard/components/user-form-dialog";
import { TemporaryPasswordDialog } from "@/dashboard/components/temporary-password-dialog";
import { deleteUserAction, resetUserPasswordAction } from "@/actions/admin/user.actions";
import type { User } from "@/generated/prisma/client";

export function UserRowActions({ user }: { user: User }) {
  const router = useRouter();
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  async function handleResetPassword() {
    const result = await resetUserPasswordAction(user.id);
    if (result.success) {
      setGeneratedPassword(result.data.temporaryPassword);
    } else {
      toast.error(result.message);
    }
  }

  const resetPasswordButton = (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Reset password for ${user.name}`}>
          <KeyRound className="size-3.5" />
        </Button>
      }
      title={`Reset ${user.name}'s password?`}
      description="Their current password stops working immediately — you'll get a new one to share with them."
      confirmLabel="Reset password"
      onConfirm={handleResetPassword}
    />
  );

  return (
    <div className="flex items-center justify-end gap-1">
      <UserFormDialog user={user} />
      {resetPasswordButton}
      {user.role !== "OWNER" && (
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
      )}
      <TemporaryPasswordDialog
        password={generatedPassword}
        onOpenChange={(next) => {
          if (!next) setGeneratedPassword(null);
        }}
      />
    </div>
  );
}
