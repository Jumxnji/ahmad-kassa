import "server-only";
import { auth } from "@/auth";
import { db } from "@/db/client";
import type { Role } from "@/permissions/roles";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * The session JWT carries `id`/`role` for fast, coarse checks (see
 * src/proxy.ts), but this function always re-reads the User row from
 * the database rather than trusting those claims — so a role change or
 * an account being suspended takes effect on the very next call, not
 * whenever the token happens to expire. This is the authoritative
 * check every `requirePermission()`/`requirePageAccess()` call is built
 * on. See docs/PROJECT_MEMORY.md for the reasoning.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.status !== "ACTIVE") return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
