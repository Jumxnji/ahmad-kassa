import { describe, expect, it } from "vitest";
import { CAMPAIGN_STATUSES, EDITABLE_CAMPAIGN_STATUSES } from "@/schemas/campaign.schema";
import { NEVER_AUTO_REACTIVATE_STATUSES, SUBSCRIBER_STATUSES, canReceiveCampaign } from "@/schemas/newsletter.schema";

describe("campaign status transitions", () => {
  it("DRAFT and READY are editable/deletable/sendable-from", () => {
    expect(EDITABLE_CAMPAIGN_STATUSES).toContain("DRAFT");
    expect(EDITABLE_CAMPAIGN_STATUSES).toContain("READY");
  });

  it("SENDING, SENT, PARTIALLY_FAILED, and CANCELLED are never editable again", () => {
    for (const status of ["SENDING", "SENT", "PARTIALLY_FAILED", "CANCELLED"] as const) {
      expect(EDITABLE_CAMPAIGN_STATUSES).not.toContain(status);
    }
  });

  it("every declared campaign status is accounted for as either editable or terminal", () => {
    const terminal = new Set(["SCHEDULED", "SENDING", "SENT", "PARTIALLY_FAILED", "CANCELLED"]);
    for (const status of CAMPAIGN_STATUSES) {
      const isEditable = (EDITABLE_CAMPAIGN_STATUSES as readonly string[]).includes(status);
      expect(isEditable || terminal.has(status)).toBe(true);
    }
  });
});

describe("subscriber suppression transitions", () => {
  it("SUPPRESSED, BOUNCED, and COMPLAINED are never auto-reactivated", () => {
    expect(NEVER_AUTO_REACTIVATE_STATUSES).toEqual(["SUPPRESSED", "BOUNCED", "COMPLAINED"]);
  });

  it("only ACTIVE subscribers are eligible for a campaign send", () => {
    for (const status of SUBSCRIBER_STATUSES) {
      expect(canReceiveCampaign(status)).toBe(status === "ACTIVE");
    }
  });
});
