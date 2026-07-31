import { z } from "zod";

export const ROLES = ["OWNER", "ADMINISTRATOR", "EDITOR", "VIEWER"] as const;
export const USER_STATUSES = ["ACTIVE", "INVITED", "SUSPENDED"] as const;

export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  role: z.enum(ROLES),
  avatarUrl: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(USER_STATUSES),
});
