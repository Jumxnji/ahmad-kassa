"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ConflictError, NotFoundError, PermissionError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { userService } from "@/services/user.service";
import { auditLogService } from "@/services/audit-log.service";
import { createUserSchema, updateUserSchema } from "@/validators/user.validator";

export async function createUserAction(values: unknown) {
  return runAction(async () => {
    const actor = await requirePermission("users", "create");

    const parsed = createUserSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    if (parsed.data.role === "OWNER") {
      throw new PermissionError("Ownership can't be granted when inviting a user.");
    }

    const existing = await userService.getByEmail(parsed.data.email);
    if (existing) throw new ConflictError("A user with that email already exists.");

    const { user, temporaryPassword } = await userService.create(parsed.data);
    await auditLogService.record({
      userId: actor.id,
      action: "user.created",
      metadata: { targetUserId: user.id, email: user.email, role: user.role },
    });
    revalidatePath("/admin/users");
    return { user, temporaryPassword };
  }, "User invited.");
}

export async function resetUserPasswordAction(id: string) {
  return runAction(async () => {
    const actor = await requirePermission("users", "update");

    const existing = await userService.get(id);
    if (!existing) throw new NotFoundError("User");

    if (existing.role === "OWNER") {
      await requirePermission("ownership", "update");
    }

    const { temporaryPassword } = await userService.resetPassword(id);
    await auditLogService.record({
      userId: actor.id,
      action: "user.password_reset_by_admin",
      metadata: { targetUserId: id, email: existing.email },
    });
    return { temporaryPassword };
  }, "Password reset.");
}

export async function updateUserAction(id: string, values: unknown) {
  return runAction(async () => {
    const actor = await requirePermission("users", "update");

    const parsed = updateUserSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await userService.get(id);
    if (!existing) throw new NotFoundError("User");

    const changingRole = parsed.data.role && parsed.data.role !== existing.role;
    const touchesOwnership = existing.role === "OWNER" || parsed.data.role === "OWNER";
    if (changingRole && touchesOwnership) {
      await requirePermission("ownership", "update");
    }

    if (existing.role === "OWNER" && actor.id !== existing.id && changingRole) {
      throw new PermissionError("Only the Owner can change their own role.");
    }

    const user = await userService.update(id, parsed.data);
    await auditLogService.record({
      userId: actor.id,
      action: "user.updated",
      metadata: {
        targetUserId: id,
        ...(changingRole ? { roleFrom: existing.role, roleTo: parsed.data.role } : {}),
        ...(parsed.data.status && parsed.data.status !== existing.status
          ? { statusFrom: existing.status, statusTo: parsed.data.status }
          : {}),
      },
    });
    revalidatePath("/admin/users");
    return user;
  }, "User updated.");
}

export async function deleteUserAction(id: string) {
  return runAction(async () => {
    const actor = await requirePermission("users", "delete");

    const existing = await userService.get(id);
    if (!existing) throw new NotFoundError("User");

    if (existing.role === "OWNER") {
      throw new PermissionError("The Owner account can't be deleted.");
    }
    if (existing.id === actor.id) {
      throw new PermissionError("You can't delete your own account.");
    }

    await userService.remove(id);
    await auditLogService.record({
      userId: actor.id,
      action: "user.deleted",
      metadata: { targetUserId: id, email: existing.email },
    });
    revalidatePath("/admin/users");
    return { id };
  }, "User removed.");
}
