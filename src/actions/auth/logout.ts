"use server";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/permissions/current-user";
import { auditLogService } from "@/services/audit-log.service";

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await auditLogService.record({ userId: user.id, action: "logout" });
  }
  await signOut({ redirect: false });
}
