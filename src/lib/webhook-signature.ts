import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Resend signs webhooks the same way Svix does: `svix-id`/`svix-timestamp`/
 * `svix-signature` headers, HMAC-SHA256 over `${id}.${timestamp}.${body}`
 * using the base64-decoded secret after its `whsec_` prefix. Hand-rolled
 * rather than adding the `svix` package — a handful of lines, matching
 * this project's existing preference for small hand-written utilities
 * (see src/lib/csv.ts) over a dependency for something this size.
 */
export function verifyResendWebhookSignature(
  payload: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string
): boolean {
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${headers.id}.${headers.timestamp}.${payload}`;
  const expected = createHmac("sha256", secretBytes).update(signedContent).digest("base64");
  const expectedBuffer = Buffer.from(expected, "base64");

  // svix-signature can carry multiple space-separated "v1,<base64>" values
  // (for secret rotation) — a match against any one of them is valid.
  return headers.signature.split(" ").some((entry) => {
    const [, candidate] = entry.split(",");
    if (!candidate) return false;
    let candidateBuffer: Buffer;
    try {
      candidateBuffer = Buffer.from(candidate, "base64");
    } catch {
      return false;
    }
    return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer);
  });
}
