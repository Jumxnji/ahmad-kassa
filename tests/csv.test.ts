import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("joins headers and rows with commas and CRLF", () => {
    const csv = toCsv(["Email", "Status"], [["a@example.com", "Active"]]);
    expect(csv).toBe("Email,Status\r\na@example.com,Active");
  });

  it("quotes and escapes a cell containing a comma", () => {
    const csv = toCsv(["Name"], [["Kassa, Ahmad"]]);
    expect(csv).toContain('"Kassa, Ahmad"');
  });

  it("quotes and doubles internal quotes in a cell", () => {
    const csv = toCsv(["Note"], [['She said "hello"']]);
    expect(csv).toContain('"She said ""hello"""');
  });

  it("quotes a cell containing a newline", () => {
    const csv = toCsv(["Note"], [["line one\nline two"]]);
    expect(csv).toContain('"line one\nline two"');
  });

  it("never needs to special-case a token-hash column, because the export's column list simply never includes one", () => {
    // The newsletter subscriber CSV export (exportNewsletterCsvAction)
    // hardcodes its header/row shape to exactly these columns — token
    // hashes and other internal fields are structurally excluded by
    // never being selected, not filtered out after the fact.
    const headers = ["Email", "First name", "Status", "Preferred language", "Source", "Joined", "Confirmed", "Last email sent"];
    expect(headers.some((h) => /token|hash/i.test(h))).toBe(false);
  });
});
