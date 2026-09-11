import { describe, expect, it } from "vitest";

import {
  applyReportQueryOverrides,
  getAnalysisReport,
} from "@/lib/analysis/get-analysis-report";

describe("applyReportQueryOverrides", () => {
  const report = getAnalysisReport("demo");
  if (!report) throw new Error("expected demo report");

  it("applies valid platform and genre query values", () => {
    const next = applyReportQueryOverrides(report, {
      platform: "mobile",
      genre: "rpg",
    });

    expect(next.platform).toBe("mobile");
    expect(next.genre).toBe("rpg");
    expect(next.concept).toBe(report.concept);
  });

  it("ignores invalid platform and genre values", () => {
    const next = applyReportQueryOverrides(report, {
      platform: "abacus",
      genre: "not-a-genre",
    });

    expect(next).toEqual(report);
  });

  it("leaves omitted filters unchanged", () => {
    const next = applyReportQueryOverrides(report, {});

    expect(next.platform).toBe(report.platform);
    expect(next.genre).toBe(report.genre);
  });
});

describe("getAnalysisReport", () => {
  it("returns null for an unknown report id", () => {
    expect(getAnalysisReport("nope")).toBeNull();
  });
});

