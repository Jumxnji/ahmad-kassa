/** Case/whitespace-insensitive email identity — "Name@Example.com" and "name@example.com" are always the same subscriber. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
