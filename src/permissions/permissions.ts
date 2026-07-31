import type { Role } from "@/permissions/roles";

/**
 * Every gate in the dashboard is expressed as (resource, action).
 * Add a resource here once — every screen and action that touches it
 * checks against this same table, so a permission change is a one-line
 * edit instead of a hunt through the codebase.
 */
export type Resource =
  | "content" // homepage, about, books
  | "questions"
  | "contact"
  | "newsletter"
  | "media"
  | "users"
  | "seo"
  | "settings"
  | "ownership"; // promoting/demoting someone to or from Owner

export type Action = "read" | "create" | "update" | "delete";

const ALL: readonly Action[] = ["read", "create", "update", "delete"];
const READ_ONLY: readonly Action[] = ["read"];

type PermissionTable = Record<Role, Partial<Record<Resource, readonly Action[]>>>;

export const ROLE_PERMISSIONS: PermissionTable = {
  OWNER: {
    content: ALL,
    questions: ALL,
    contact: ALL,
    newsletter: ALL,
    media: ALL,
    users: ALL,
    seo: ALL,
    settings: ALL,
    ownership: ALL,
  },
  ADMINISTRATOR: {
    content: ALL,
    questions: ALL,
    contact: ALL,
    newsletter: ALL,
    media: ALL,
    users: ["read", "create", "update"], // cannot delete, cannot touch ownership
    seo: ALL,
    settings: ALL,
    // no `ownership` entry at all — cannot promote/demote an Owner
  },
  EDITOR: {
    content: ALL,
    media: ["read", "create", "update"],
    questions: READ_ONLY,
    contact: READ_ONLY,
    newsletter: READ_ONLY,
    seo: ["read", "update"],
  },
  VIEWER: {
    content: READ_ONLY,
    questions: READ_ONLY,
    contact: READ_ONLY,
    newsletter: READ_ONLY,
    media: READ_ONLY,
    users: READ_ONLY,
    seo: READ_ONLY,
    settings: READ_ONLY,
  },
};

export function can(role: Role, resource: Resource, action: Action): boolean {
  const allowed = ROLE_PERMISSIONS[role]?.[resource];
  return allowed?.includes(action) ?? false;
}
