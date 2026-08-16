import { describe, expect, it } from "vitest";
import { can } from "@/permissions/permissions";

describe("can() — campaigns resource", () => {
  it("lets OWNER send campaigns", () => {
    expect(can("OWNER", "campaigns", "send")).toBe(true);
  });

  it("lets ADMINISTRATOR send campaigns", () => {
    expect(can("ADMINISTRATOR", "campaigns", "send")).toBe(true);
  });

  it("does not let EDITOR send campaigns", () => {
    expect(can("EDITOR", "campaigns", "send")).toBe(false);
  });

  it("still lets EDITOR draft and edit campaigns", () => {
    expect(can("EDITOR", "campaigns", "create")).toBe(true);
    expect(can("EDITOR", "campaigns", "update")).toBe(true);
    expect(can("EDITOR", "campaigns", "delete")).toBe(true);
  });

  it("gives VIEWER read-only access", () => {
    expect(can("VIEWER", "campaigns", "read")).toBe(true);
    expect(can("VIEWER", "campaigns", "create")).toBe(false);
    expect(can("VIEWER", "campaigns", "send")).toBe(false);
  });

  it("leaves subscriber management untouched for EDITOR — read-only, as before this sprint", () => {
    expect(can("EDITOR", "newsletter", "read")).toBe(true);
    expect(can("EDITOR", "newsletter", "update")).toBe(false);
  });
});
