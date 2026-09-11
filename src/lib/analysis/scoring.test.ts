import { describe, expect, it } from "vitest";

import {
  deriveMarketLandscape,
  getEvidenceForTheme,
  groupThemesBySentiment,
} from "@/lib/analysis/scoring";
import type { ComparableGame, EvidenceReview, ReviewTheme } from "@/lib/analysis/types";

function buildGame(overrides: Partial<ComparableGame>): ComparableGame {
  return {
    appId: 1,
    name: "Test Game",
    similarity: 0.5,
    totalReviews: 1000,
    positiveRatio: 0.8,
    genres: ["Survival"],
    releaseYear: 2020,
    price: "$19.99",
    ...overrides,
  };
}

describe("deriveMarketLandscape", () => {
  const games: readonly ComparableGame[] = [
    buildGame({ totalReviews: 1_000, positiveRatio: 0.7, releaseYear: 2024 }),
    buildGame({ totalReviews: 3_000, positiveRatio: 0.9, releaseYear: 2019 }),
  ];

  it("computes the median review count across all comparable games", () => {
    expect(deriveMarketLandscape(games, 2026).medianReviewCount).toBe(2_000);
  });

  it("computes the average positive ratio across all comparable games", () => {
    expect(deriveMarketLandscape(games, 2026).averagePositiveRatio).toBeCloseTo(0.8);
  });

  it("counts titles released within the recency window", () => {
    // 2024 is within 5 years of 2026; 2019 is not.
    expect(deriveMarketLandscape(games, 2026).recentReleaseRatio).toBe("1 / 2");
  });

  it("classifies density from the median review count", () => {
    const denseGames = [buildGame({ totalReviews: 80_000 }), buildGame({ totalReviews: 90_000 })];
    const sparseGames = [buildGame({ totalReviews: 500 }), buildGame({ totalReviews: 800 })];
    const moderateGames = [
      buildGame({ totalReviews: 20_000 }),
      buildGame({ totalReviews: 30_000 }),
    ];

    expect(deriveMarketLandscape(denseGames, 2026).density).toBe("high");
    expect(deriveMarketLandscape(sparseGames, 2026).density).toBe("low");
    expect(deriveMarketLandscape(moderateGames, 2026).density).toBe("moderate");
  });
});

describe("groupThemesBySentiment", () => {
  const themes: readonly ReviewTheme[] = [
    {
      id: "a",
      sentiment: "positive",
      label: "A",
      percentage: 10,
      reviewCount: 10,
      gamesFoundIn: 1,
      gamesTotal: 2,
      confidence: "low",
    },
    {
      id: "b",
      sentiment: "complaint",
      label: "B",
      percentage: 20,
      reviewCount: 20,
      gamesFoundIn: 2,
      gamesTotal: 2,
      confidence: "high",
    },
  ];

  it("splits themes into positive and complaint buckets", () => {
    const { positive, complaint } = groupThemesBySentiment(themes);

    expect(positive.map((theme) => theme.id)).toEqual(["a"]);
    expect(complaint.map((theme) => theme.id)).toEqual(["b"]);
  });
});

describe("getEvidenceForTheme", () => {
  const evidence: readonly EvidenceReview[] = [
    {
      id: "ev-1",
      gameName: "Game A",
      sentiment: "negative",
      playtimeHours: 10,
      reviewText: "Text",
      helpfulVotes: 1,
      steamPurchase: true,
      themeId: "weak-coop-progression",
    },
    {
      id: "ev-2",
      gameName: "Game B",
      sentiment: "positive",
      playtimeHours: 20,
      reviewText: "Text",
      helpfulVotes: 2,
      steamPurchase: true,
      themeId: "atmosphere",
    },
  ];

  it("returns only reviews matching the given theme id", () => {
    expect(getEvidenceForTheme(evidence, "weak-coop-progression")).toEqual([evidence[0]]);
  });

  it("returns an empty array when no reviews match", () => {
    expect(getEvidenceForTheme(evidence, "nonexistent")).toEqual([]);
  });
});

describe("deriveMarketLandscape empty input", () => {
  it("returns a zeroed landscape instead of NaN ratios", () => {
    const landscape = deriveMarketLandscape([]);
    expect(landscape.comparableTitles).toBe(0);
    expect(landscape.medianReviewCount).toBe(0);
    expect(landscape.averagePositiveRatio).toBe(0);
    expect(landscape.recentReleaseRatio).toBe("0 / 0");
  });
});
