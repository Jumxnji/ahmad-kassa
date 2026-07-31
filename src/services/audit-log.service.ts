import "server-only";
import { auditLogRepository } from "@/repositories/audit-log.repository";
import type { Prisma } from "@/generated/prisma/client";

export interface AuditLogEntry {
  userId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
}

/**
 * Records a security-relevant event. Architecture is deliberately
 * generic (`action` is a free-form string, `metadata` a JSON bag) so
 * new event types never require a schema change — see
 * docs/PROJECT_MEMORY.md for the list of events currently wired in
 * and which ones are natural next additions (content edits, etc).
 *
 * Never throws — a logging failure should not block the action that
 * triggered it.
 */
export const auditLogService = {
  async record(entry: AuditLogEntry) {
    try {
      await auditLogRepository.create({
        userId: entry.userId ?? null,
        action: entry.action,
        metadata: (entry.metadata as Prisma.InputJsonValue) ?? undefined,
        ipAddress: entry.ipAddress ?? null,
      });
    } catch (error) {
      console.error("[auditLogService] Failed to record entry:", error);
    }
  },

  list: (opts?: { userId?: string; action?: string; take?: number }) =>
    auditLogRepository.findMany({
      where: {
        ...(opts?.userId ? { userId: opts.userId } : {}),
        ...(opts?.action ? { action: opts.action } : {}),
      },
      take: opts?.take,
    }),
};
