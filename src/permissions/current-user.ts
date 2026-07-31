import "server-only";
import { db } from "@/db/client";
import type { Role } from "@/permissions/roles";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * STUB — there is no auth/session system yet (intentionally, per this
 * sprint's brief). This resolves to the seeded Owner account so every
 * dashboard screen and action can be built and tested against a real
 * permission check today.
 *
 * When real auth lands, replace the body of this function with a
 * session lookup (e.g. reading a cookie-based session, then loading
 * the User row) — every call site already expects `CurrentUser | null`
 * and every permission check already goes through can()/requirePermission(),
 * so nothing outside this file should need to change.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const owner = await db.user.findFirst({
    where: { role: "OWNER" },
    orderBy: { createdAt: "asc" },
  });

  if (!owner) return null;

  return { id: owner.id, name: owner.name, email: owner.email, role: owner.role };
}
