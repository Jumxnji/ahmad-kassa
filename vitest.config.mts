import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Scope: pure-logic unit tests only (see tests/*.test.ts) — no
 * DB-backed integration tests. This is the project's first sprint
 * with a test framework at all; every prior sprint's actual
 * verification method was manual browser testing, and that stays true
 * here for anything that touches Prisma/Next.js request context.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
