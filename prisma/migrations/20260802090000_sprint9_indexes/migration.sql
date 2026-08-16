-- Sprint 9: composite/singular indexes for common query patterns
-- found during the launch-readiness performance audit.

-- Matches bookService.listPublic()'s actual filter+sort pattern
-- (status IN (...), ORDER BY featured DESC, publicationDate DESC).
CREATE INDEX "books_status_featured_idx" ON "books"("status", "featured");

-- Admin Contact Messages inbox's default sort.
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");
