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
  | "newsletter" // subscriber management
  | "campaigns" // newsletter campaign drafting/sending — its own resource, same precedent as "ownership" below
  | "media"
  | "users"
  | "seo"
  | "settings"
  | "ownership"; // promoting/demoting someone to or from Owner

export type Action = "read" | "create" | "update" | "delete" | "send";

const ALL: readonly Action[] = ["read", "create", "update", "delete"];
const READ_ONLY: readonly Action[] = ["read"];
/** Everything a campaign resource needs except sending to the full active list. */
const CAMPAIGN_EDIT: readonly Action[] = ["read", "create", "update", "delete"];
const CAMPAIGN_ALL: readonly Action[] = ["read", "create", "update", "delete", "send"];

type PermissionTable = Record<Role, Partial<Record<Resource, readonly Action[]>>>;

export const ROLE_PERMISSIONS: PermissionTable = {
  OWNER: {
    content: ALL,
    questions: ALL,
    contact: ALL,
    newsletter: ALL,
    campaigns: CAMPAIGN_ALL,
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
    campaigns: CAMPAIGN_ALL,
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
    // Can draft, edit, preview, and send test emails (all gated on
    // "update") — but cannot send to the full active list.
    campaigns: CAMPAIGN_EDIT,
    seo: ["read", "update"],
  },
  VIEWER: {
    content: READ_ONLY,
    questions: READ_ONLY,
    contact: READ_ONLY,
    newsletter: READ_ONLY,
    campaigns: READ_ONLY,
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
