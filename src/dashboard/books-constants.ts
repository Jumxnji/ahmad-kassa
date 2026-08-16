import type { $Enums } from "@/generated/prisma/client";

export const BOOK_STATUS_LABEL: Record<$Enums.BookStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  COMING_SOON: "Coming soon",
  ARCHIVED: "Archived",
};

export const BOOK_STATUS_TONE = {
  DRAFT: "muted",
  PUBLISHED: "success",
  COMING_SOON: "warning",
  ARCHIVED: "muted",
} as const;
