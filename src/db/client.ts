import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Standard Next.js dev-mode singleton: hot reload re-evaluates this
 * module on every edit, which would otherwise open a fresh Postgres
 * connection pool each time. Stashing the instance on `globalThis`
 * survives the reload; production always gets a clean instance.
 *
 * Prisma 7 requires an explicit driver adapter — there is no more
 * bundled native query engine, so `new PrismaClient()` alone throws.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
