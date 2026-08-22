import { describe, expect, it } from "vitest";
import { resolveFeaturedKhutbahs } from "@/lib/featured-khutbahs";

describe("resolveFeaturedKhutbahs", () => {
  it("returns primary and both supporting slots when all three are present", () => {
    const result = resolveFeaturedKhutbahs("a", "b", "c");
    expect(result.primary).toBe("a");
    expect(result.secondary).toEqual(["b", "c"]);
  });

  it("promotes supporting 1 to primary when primary is missing", () => {
    const result = resolveFeaturedKhutbahs(null, "b", "c");
    expect(result.primary).toBe("b");
    expect(result.secondary).toEqual(["c"]);
  });

  it("promotes supporting 2 to primary when primary and supporting 1 are missing", () => {
    const result = resolveFeaturedKhutbahs(null, null, "c");
    expect(result.primary).toBe("c");
    expect(result.secondary).toEqual([]);
  });

  it("skips a missing supporting 1 and still uses supporting 2", () => {
    const result = resolveFeaturedKhutbahs("a", null, "c");
    expect(result.primary).toBe("a");
    expect(result.secondary).toEqual(["c"]);
  });

  it("returns a null primary and empty secondary when nothing is available", () => {
    const result = resolveFeaturedKhutbahs(null, null, null);
    expect(result.primary).toBeNull();
    expect(result.secondary).toEqual([]);
  });

  it("never returns more than two secondary entries", () => {
    const result = resolveFeaturedKhutbahs("a", "b", "c");
    expect(result.secondary.length).toBeLessThanOrEqual(2);
  });
});
