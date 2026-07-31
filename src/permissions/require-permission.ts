import "server-only";
import { PermissionError } from "@/lib/errors";
import { getCurrentUser } from "@/permissions/current-user";
import { can, type Action, type Resource } from "@/permissions/permissions";

/**
 * Call at the top of every server action that mutates or reads
 * privileged data. Throws `PermissionError` (caught by the action's
 * try/catch and turned into a normal `ActionResult`) rather than
 * silently failing.
 */
export async function requirePermission(resource: Resource, action: Action) {
  const user = await getCurrentUser();

  if (!user) {
    throw new PermissionError("You need to be signed in to do that.");
  }

  if (!can(user.role, resource, action)) {
    throw new PermissionError();
  }

  return user;
}
