import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyResendWebhookSignature } from "@/lib/webhook-signature";

const SECRET = "whsec_ZGV2LW9ubHktcmVzZW5kLXdlYmhvb2stc2VjcmV0"; // base64("dev-only-resend-webhook-secret")

function sign(payload: string, id: string, timestamp: string, secret: string): string {
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${payload}`;
  return createHmac("sha256", secretBytes).update(signedContent).digest("base64");
}

describe("verifyResendWebhookSignature", () => {
  it("accepts a correctly signed payload", () => {
    const payload = JSON.stringify({ type: "email.bounced", data: { email_id: "abc" } });
    const id = "msg_1";
    const timestamp = "1700000000";
    const signature = `v1,${sign(payload, id, timestamp, SECRET)}`;

    expect(verifyResendWebhookSignature(payload, { id, timestamp, signature }, SECRET)).toBe(true);
  });

  it("rejects a tampered payload", () => {
    const payload = JSON.stringify({ type: "email.bounced", data: { email_id: "abc" } });
    const id = "msg_1";
    const timestamp = "1700000000";
    const signature = `v1,${sign(payload, id, timestamp, SECRET)}`;
    const tamperedPayload = JSON.stringify({ type: "email.bounced", data: { email_id: "zzz" } });

    expect(verifyResendWebhookSignature(tamperedPayload, { id, timestamp, signature }, SECRET)).toBe(false);
  });

  it("rejects a signature computed with the wrong secret", () => {
    const payload = JSON.stringify({ type: "email.complained", data: { email_id: "abc" } });
    const id = "msg_2";
    const timestamp = "1700000001";
    const signature = `v1,${sign(payload, id, timestamp, "whsec_d3Jvbmctc2VjcmV0")}`;

    expect(verifyResendWebhookSignature(payload, { id, timestamp, signature }, SECRET)).toBe(false);
  });

  it("rejects a garbage signature header without throwing", () => {
    expect(
      verifyResendWebhookSignature("{}", { id: "x", timestamp: "1", signature: "not-a-real-signature" }, SECRET)
    ).toBe(false);
  });

  it("accepts when any one of multiple space-separated signatures matches (secret rotation)", () => {
    const payload = JSON.stringify({ type: "email.bounced", data: { email_id: "abc" } });
    const id = "msg_3";
    const timestamp = "1700000002";
    const real = sign(payload, id, timestamp, SECRET);
    const signature = `v1,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= v1,${real}`;

    expect(verifyResendWebhookSignature(payload, { id, timestamp, signature }, SECRET)).toBe(true);
  });
});
