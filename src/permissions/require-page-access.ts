import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/permissions/current-user";
import { can, type Action, type Resource } from "@/permissions/permissions";

/**
 * Call at the top of a Server Component page that only some roles
 * should be able to view at all (Users, Settings — Editor has no
 * entry for either in ROLE_PERMISSIONS). Unlike requirePermission()
 * (which throws, for use inside a Server Action's try/catch), this
 * redirects, since a page render has no ActionResult to return.
 */
export async function requirePageAccess(resource: Resource, action: Action = "read") {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!can(user.role, resource, action)) {
    redirect("/admin/unauthorized");
  }

  return user;
}
