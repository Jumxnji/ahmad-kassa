import { describe, expect, it } from "vitest";
import { canAddHomepageCredential } from "@/lib/homepage-credentials";
import { MAX_HOMEPAGE_CREDENTIALS } from "@/schemas/homepage.schema";

describe("canAddHomepageCredential", () => {
  it("allows adding when the list is empty", () => {
    expect(canAddHomepageCredential(0)).toBe(true);
  });

  it("allows adding one below the cap", () => {
    expect(canAddHomepageCredential(MAX_HOMEPAGE_CREDENTIALS - 1)).toBe(true);
  });

  it("blocks adding once the cap is reached", () => {
    expect(canAddHomepageCredential(MAX_HOMEPAGE_CREDENTIALS)).toBe(false);
  });

  it("blocks adding when already over the cap", () => {
    expect(canAddHomepageCredential(MAX_HOMEPAGE_CREDENTIALS + 1)).toBe(false);
  });

  it("the cap is exactly 4, matching the section's tested vertical rhythm", () => {
    expect(MAX_HOMEPAGE_CREDENTIALS).toBe(4);
  });
});
