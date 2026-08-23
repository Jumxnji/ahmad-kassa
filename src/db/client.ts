import "server-only";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Standard Next.js dev-mode singleton: hot reload re-evaluates this
 * module on every edit, which would otherwise open a fresh Postgres
 * connection pool each time. Stashing the instance on `globalThis`
 * survives the reload; production always gets a clean instance.
 *
 * Prisma 7 requires an explicit driver adapter — there is no more
 * bundled native query engine, so `new PrismaClient()` alone throws.
 *
 * Uses Neon's WebSocket driver rather than `@prisma/adapter-pg`'s raw
 * TCP connection — this is Prisma/Neon's own current recommended
 * pattern for serverless runtimes (confirmed against the installed
 * `@prisma/adapter-neon` package's own README, not just blog posts),
 * not a workaround for any one host. Vercel Functions can spin up many
 * concurrent short-lived invocations; `DATABASE_URL` should be Neon's
 * *pooled* connection string in that environment so those invocations
 * share Neon's built-in pooler instead of each opening a fresh Postgres
 * connection. This ties the app to Neon specifically (its serverless
 * driver only proxies to Neon's own infrastructure) rather than "any
 * Postgres provider" — a deliberate trade-off given Neon is the chosen
 * production database. Prisma Migrate itself is unaffected by this:
 * the CLI (`prisma migrate deploy`/`generate`) reads the plain
 * `DATABASE_URL` from `prisma.config.ts` and always connects directly,
 * with no knowledge of this adapter at all — run migrations with the
 * *direct* (unpooled) connection string, from local dev or CI, never
 * from a Vercel Function. See docs/DEPLOYMENT.md.
 */
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
