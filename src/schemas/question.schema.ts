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

export const QUESTION_STATUSES = ["PENDING", "ANSWERED", "ARCHIVED"] as const;

export const questionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  category: z.enum(QUESTION_CATEGORIES),
  question: z.string().min(10).max(2000),
  isPrivate: z.boolean(),
  status: z.enum(QUESTION_STATUSES),
  answer: z.string().max(4000).optional().nullable(),
});
