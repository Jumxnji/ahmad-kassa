import "server-only";
import { questionService } from "@/services/question.service";
import { contactService } from "@/services/contact.service";

export interface NotificationSummary {
  unreadQuestions: number;
  unreadMessages: number;
  total: number;
  recentQuestions: { id: string; name: string; referenceNumber: string; createdAt: Date }[];
  recentMessages: { id: string; name: string; subject: string; createdAt: Date }[];
}

/**
 * Powers the dashboard's notification bell. Computed on demand from
 * existing counts/lists rather than a stored "notifications" table —
 * there's nothing here that isn't already a cheap, indexed query, and
 * a derived count can never drift out of sync with the data it counts.
 */
export const notificationService = {
  async getSummary(): Promise<NotificationSummary> {
    const [unreadQuestions, unreadMessages, recentQuestionRows, recentMessageRows] = await Promise.all([
      questionService.countUnread(),
      contactService.countUnread(),
      questionService.list({ status: "NEW" }),
      contactService.list({ status: "NEW" }),
    ]);

    return {
      unreadQuestions,
      unreadMessages,
      total: unreadQuestions + unreadMessages,
      recentQuestions: recentQuestionRows
        .slice(0, 5)
        .map((q) => ({ id: q.id, name: q.name, referenceNumber: q.referenceNumber, createdAt: q.createdAt })),
      recentMessages: recentMessageRows
        .slice(0, 5)
        .map((m) => ({ id: m.id, name: m.name, subject: m.subject, createdAt: m.createdAt })),
    };
  },
};
