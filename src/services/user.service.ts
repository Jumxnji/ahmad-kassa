import "server-only";
import { userRepository } from "@/repositories/user.repository";
import { generateSecurePassword, hashPassword } from "@/lib/password";
import type { Prisma } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";
import type { CreateUserInput, UpdateUserInput } from "@/validators/user.validator";

const SORTABLE_FIELDS = new Set(["name", "role", "status", "lastLoginAt", "createdAt"]);

export const userService = {
  list: () => userRepository.findMany(),
  get: (id: string) => userRepository.findById(id),
  getByEmail: (email: string) => userRepository.findByEmail(email),
  count: () => userRepository.count(),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.UserWhereInput = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { email: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      userRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      userRepository.count(where),
    ]);

    return { rows, total };
  },

  update: (id: string, input: UpdateUserInput) => userRepository.update(id, input),
  remove: (id: string) => userRepository.delete(id),

  recordLogin: (id: string) => userRepository.update(id, { lastLoginAt: new Date() }),

  /**
   * A newly invited user needs a real password to actually sign in —
   * there's no invite-email flow yet (see docs/PROJECT_MEMORY.md), so
   * a securely generated temporary password is created here and
   * handed back once for the Owner to relay. The Owner can generate a
   * fresh one at any time via resetPassword() below.
   */
  async create(input: CreateUserInput): Promise<{ user: Awaited<ReturnType<typeof userRepository.create>>; temporaryPassword: string }> {
    const temporaryPassword = generateSecurePassword();
    const passwordHash = await hashPassword(temporaryPassword);
    const user = await userRepository.create({ ...input, passwordHash });
    return { user, temporaryPassword };
  },

  async resetPassword(id: string): Promise<{ temporaryPassword: string }> {
    const temporaryPassword = generateSecurePassword();
    const passwordHash = await hashPassword(temporaryPassword);
    await userRepository.update(id, { passwordHash });
    return { temporaryPassword };
  },
};
