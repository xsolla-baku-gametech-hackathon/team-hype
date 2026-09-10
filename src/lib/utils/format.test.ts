import { describe, expect, it } from "vitest";

import { capitalize, formatCompactNumber, formatNumber, formatPercentage } from "@/lib/utils/format";

describe("formatNumber", () => {
  it("adds thousands separators", () => {
    expect(formatNumber(2846)).toBe("2,846");
  });
});

describe("formatCompactNumber", () => {
  it("compacts large review counts", () => {
    expect(formatCompactNumber(8200)).toBe("8.2K");
  });

  it("leaves small numbers unabbreviated", () => {
    expect(formatCompactNumber(42)).toBe("42");
  });
});

describe("formatPercentage", () => {
  it("converts a 0-1 ratio to a rounded percentage", () => {
    expect(formatPercentage(0.87)).toBe("87%");
  });

  it("rounds to the nearest whole percent", () => {
    expect(formatPercentage(0.865)).toBe("87%");
  });
});

describe("capitalize", () => {
  it("uppercases only the first character", () => {
    expect(capitalize("moderate")).toBe("Moderate");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
