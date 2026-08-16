import { describe, expect, it } from "vitest";
import {
  generateToken,
  hashToken,
  isTokenExpired,
  unsubscribeToken,
  verifyUnsubscribeToken,
} from "@/lib/newsletter-token";

describe("confirmation tokens", () => {
  it("generates high-entropy, unique tokens", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).not.toBe(b);
    expect(a).toHaveLength(64); // 32 bytes, hex-encoded
  });

  it("hashes deterministically — the same raw token always hashes the same", () => {
    const token = generateToken();
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it("produces different hashes for different tokens", () => {
    expect(hashToken(generateToken())).not.toBe(hashToken(generateToken()));
  });
});

describe("isTokenExpired", () => {
  it("is not expired when there's no expiry set", () => {
    expect(isTokenExpired(null)).toBe(false);
  });

  it("is expired once past the expiry time", () => {
    const past = new Date(Date.now() - 1000);
    expect(isTokenExpired(past)).toBe(true);
  });

  it("is not expired before the expiry time", () => {
    const future = new Date(Date.now() + 1000);
    expect(isTokenExpired(future)).toBe(false);
  });
});

describe("unsubscribe tokens", () => {
  it("is deterministic for the same subscriber id", () => {
    const id = "11111111-1111-1111-1111-111111111111";
    expect(unsubscribeToken(id)).toBe(unsubscribeToken(id));
  });

  it("differs between subscribers", () => {
    expect(unsubscribeToken("subscriber-a")).not.toBe(unsubscribeToken("subscriber-b"));
  });

  it("verifies a token generated for the right subscriber", () => {
    const id = "22222222-2222-2222-2222-222222222222";
    expect(verifyUnsubscribeToken(id, unsubscribeToken(id))).toBe(true);
  });

  it("rejects a token generated for a different subscriber", () => {
    const token = unsubscribeToken("subscriber-a");
    expect(verifyUnsubscribeToken("subscriber-b", token)).toBe(false);
  });

  it("rejects garbage input without throwing", () => {
    expect(verifyUnsubscribeToken("subscriber-a", "not-valid-hex-!!")).toBe(false);
  });
});
