import "server-only";
import { referenceCounterRepository } from "@/repositories/reference-counter.repository";

/**
 * Human-facing reference numbers — "AMK-2026-000023" — one atomic
 * counter per entity-type-per-year (key: "question-2026"), so the
 * pattern is reusable for any future entity (contact enquiries,
 * bookings, invoices) without inventing a new counter mechanism.
 */
export const referenceNumberService = {
  async next(entityType: string): Promise<string> {
    const year = new Date().getFullYear();
    const key = `${entityType}-${year}`;
    const value = await referenceCounterRepository.increment(key);
    return `AMK-${year}-${String(value).padStart(6, "0")}`;
  },
};
