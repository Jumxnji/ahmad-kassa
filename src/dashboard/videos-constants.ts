import type { $Enums } from "@/generated/prisma/client";

export const VIDEO_STATUS_LABEL: Record<$Enums.ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

export const VIDEO_STATUS_TONE = {
  DRAFT: "muted",
  PUBLISHED: "success",
} as const;
