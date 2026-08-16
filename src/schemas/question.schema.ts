import { z } from "zod";

export const QUESTION_CATEGORIES = [
  "MARRIAGE",
  "FAMILY",
  "AQEEDAH",
  "FIQH",
  "RUQYAH",
  "MENTAL_HEALTH",
  "OTHER",
] as const;

export const QUESTION_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "WAITING",
  "ANSWERED",
  "CLOSED",
  "ARCHIVED",
] as const;

export const QUESTION_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export const questionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  category: z.enum(QUESTION_CATEGORIES),
  subject: z.string().max(150).optional().nullable(),
  initialMessage: z.string().min(10).max(2000),
  isPrivate: z.boolean(),
  status: z.enum(QUESTION_STATUSES),
  priority: z.enum(QUESTION_PRIORITIES),
});
