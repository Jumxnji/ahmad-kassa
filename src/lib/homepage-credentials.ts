import { MAX_HOMEPAGE_CREDENTIALS } from "@/schemas/homepage.schema";

/** Pure cap check — a credential can be added only while under the 4-item limit (see the Prisma schema's comment on `HomepageCredential` for why 4). */
export function canAddHomepageCredential(currentCount: number): boolean {
  return currentCount < MAX_HOMEPAGE_CREDENTIALS;
}
