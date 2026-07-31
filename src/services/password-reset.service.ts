import "server-only";
import { randomBytes } from "node:crypto";
import { passwordResetTokenRepository } from "@/repositories/password-reset-token.repository";
import { userRepository } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/password";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export const passwordResetService = {
  /**
   * Always safe to call with any email — returns a token only when a
   * real, active, credentials-based account exists, so the caller
   * (the server action) can show the same generic "check your email"
   * message either way and never reveal which emails are registered.
   */
  async requestReset(email: string): Promise<{ token: string; userId: string; name: string } | null> {
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== "ACTIVE") return null;

    await passwordResetTokenRepository.deleteAllForUser(user.id);

    const token = randomBytes(32).toString("hex");
    await passwordResetTokenRepository.create({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    return { token, userId: user.id, name: user.name };
  },

  async consumeReset(
    token: string,
    newPassword: string
  ): Promise<{ success: true; userId: string } | { success: false; message: string }> {
    const record = await passwordResetTokenRepository.findByToken(token);

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return { success: false, message: "This reset link is invalid or has expired." };
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.update(record.userId, { passwordHash });
    await passwordResetTokenRepository.deleteAllForUser(record.userId);

    return { success: true, userId: record.userId };
  },
};
