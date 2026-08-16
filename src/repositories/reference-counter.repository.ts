import "server-only";
import { db } from "@/db/client";

export const referenceCounterRepository = {
  /**
   * Atomically increments the counter for `key` and returns the new
   * value. Backed by Postgres `INSERT ... ON CONFLICT DO UPDATE SET
   * value = value + 1`, which is safe under concurrent callers — two
   * requests racing to submit a question at the same instant can never
   * be handed the same number.
   */
  async increment(key: string): Promise<number> {
    const row = await db.referenceCounter.upsert({
      where: { key },
      update: { value: { increment: 1 } },
      create: { key, value: 1 },
    });
    return row.value;
  },
};
