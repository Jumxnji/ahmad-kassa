import { describe, expect, it } from "vitest";
import { homepageContentSchema } from "@/schemas/homepage.schema";

const BASE = {
  heroEyebrow: "Islamic Teacher · Author · Khateeb",
  heroHeadline: "Ahmad Mohamed Kassa",
  heroSubtitle: "A short subtitle.",
  heroPrimaryCtaLabel: "Explore Books",
  heroPrimaryCtaHref: "/books",
  heroSecondaryCtaLabel: "Browse Articles",
  heroSecondaryCtaHref: "/articles",
  aboutEyebrow: "Who teaches here",
  aboutSubtitle: "Author · Teacher · Khateeb",
  aboutLede: "A lede long enough to pass validation.",
  aboutBody: "A body long enough to pass validation easily.",
  newsletterHeadline: "Stay connected, without the noise",
  newsletterText: "Announcements delivered straight from Ahmad. No spam.",
  status: "PUBLISHED" as const,
};

const ID_A = "11111111-1111-4111-8111-111111111111";
const ID_B = "22222222-2222-4222-8222-222222222222";
const ID_C = "33333333-3333-4333-8333-333333333333";

describe("homepageContentSchema — featured khutbah slot uniqueness", () => {
  it("accepts three distinct video ids", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: ID_A,
      supportingKhutbah1Id: ID_B,
      supportingKhutbah2Id: ID_C,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all slots empty", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: null,
      supportingKhutbah1Id: null,
      supportingKhutbah2Id: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts one slot filled and the rest empty", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: ID_A,
      supportingKhutbah1Id: null,
      supportingKhutbah2Id: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects the same video assigned to primary and supporting 1", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: ID_A,
      supportingKhutbah1Id: ID_A,
      supportingKhutbah2Id: ID_C,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.join(".") === "supportingKhutbah1Id");
      expect(issue?.message).toBe("Each khutbah can only be assigned to one slot.");
    }
  });

  it("rejects the same video assigned to primary and supporting 2", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: ID_A,
      supportingKhutbah1Id: ID_B,
      supportingKhutbah2Id: ID_A,
    });
    expect(result.success).toBe(false);
  });

  it("rejects the same video assigned to both supporting slots", () => {
    const result = homepageContentSchema.safeParse({
      ...BASE,
      primaryKhutbahId: ID_A,
      supportingKhutbah1Id: ID_B,
      supportingKhutbah2Id: ID_B,
    });
    expect(result.success).toBe(false);
  });
});
