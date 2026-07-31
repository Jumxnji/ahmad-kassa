import "server-only";
import { db } from "@/db/client";

export const passwordResetTokenRepository = {
  create(data: { token: string; userId: string; expiresAt: Date }) {
    return db.passwordResetToken.create({ data });
  },

  findByToken(token: string) {
    return db.passwordResetToken.findUnique({ where: { token }, include: { user: true } });
  },

  markUsed(id: string) {
    return db.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  },

  /** Invalidate any earlier outstanding tokens when a new one is requested, or once one is consumed. */
  deleteAllForUser(userId: string) {
    return db.passwordResetToken.deleteMany({ where: { userId } });
  },
};
