import { describe, expect, it } from "vitest";
import { normalizeEmail } from "@/lib/normalize-email";

describe("normalizeEmail", () => {
  it("lowercases the email", () => {
    expect(normalizeEmail("Name@Example.com")).toBe("name@example.com");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  name@example.com  ")).toBe("name@example.com");
  });

  it("treats differently-cased addresses as identical", () => {
    expect(normalizeEmail("Fatima.K@Example.COM")).toBe(normalizeEmail("fatima.k@example.com"));
  });
});
