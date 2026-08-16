import type { $Enums } from "@/generated/prisma/client";

export const QUESTION_STATUS_LABEL: Record<$Enums.QuestionStatus, string> = {
  NEW: "New",
  IN_REVIEW: "In Review",
  WAITING: "Waiting",
  ANSWERED: "Answered",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

export const QUESTION_STATUS_TONE = {
  NEW: "warning",
  IN_REVIEW: "neutral",
  WAITING: "neutral",
  ANSWERED: "success",
  CLOSED: "muted",
  ARCHIVED: "muted",
} as const;

export const QUESTION_CATEGORY_LABEL: Record<$Enums.QuestionCategory, string> = {
  MARRIAGE: "Marriage",
  FAMILY: "Family",
  AQEEDAH: "Aqeedah",
  FIQH: "Fiqh",
  RUQYAH: "Ruqyah",
  MENTAL_HEALTH: "Mental Health",
  OTHER: "Other",
};

export const QUESTION_PRIORITY_TONE = {
  LOW: "muted",
  NORMAL: "neutral",
  HIGH: "warning",
  URGENT: "warning",
} as const;
