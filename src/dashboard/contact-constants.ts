import type { $Enums } from "@/generated/prisma/client";

export const CONTACT_STATUS_LABEL: Record<$Enums.ContactStatus, string> = {
  NEW: "Unread",
  READ: "Read",
  ARCHIVED: "Archived",
};

export const CONTACT_STATUS_TONE = {
  NEW: "warning",
  READ: "neutral",
  ARCHIVED: "muted",
} as const;
