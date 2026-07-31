import "server-only";
import { userRepository } from "@/repositories/user.repository";
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

  create: (input: CreateUserInput) => userRepository.create(input),
  update: (id: string, input: UpdateUserInput) => userRepository.update(id, input),
  remove: (id: string) => userRepository.delete(id),

  recordLogin: (id: string) => userRepository.update(id, { lastLoginAt: new Date() }),
};
