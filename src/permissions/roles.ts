import type { $Enums } from "@/generated/prisma/client";

/** Re-exported from the Prisma enum — the single source of truth for
 * what a "role" is. Don't redefine this union elsewhere. */
export type Role = $Enums.Role;

export const ROLES: readonly Role[] = ["OWNER", "ADMINISTRATOR", "EDITOR", "VIEWER"] as const;

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Owner",
  ADMINISTRATOR: "Administrator",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  OWNER: "Full access to everything, including ownership and billing.",
  ADMINISTRATOR: "Manages content, questions, and the newsletter. Cannot change ownership.",
  EDITOR: "Can create and edit content. No access to users or settings.",
  VIEWER: "Read-only access across the dashboard.",
};
