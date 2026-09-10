import type {
  ComparableGame,
  EvidenceReview,
  MarketDensity,
  MarketLandscape,
  ReviewTheme,
} from "@/lib/analysis/types";

/** Titles released within this many years of `referenceYear` count as "recent". */
const RECENT_RELEASE_WINDOW_YEARS = 5;

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  // Even-length lists have two middle values; Steam review counts are
  // never negative, so a plain average of the two is safe here.
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Competitive density is proxied by how much review volume comparable
 * titles typically accumulate — a market where competitors have tens of
 * thousands of reviews each is more contested than one where they have a
 * few thousand.
 */
function deriveMarketDensity(medianReviewCount: number): MarketDensity {
  if (medianReviewCount >= 50_000) return "high";
  if (medianReviewCount >= 10_000) return "moderate";
  return "low";
}

/**
 * Computes market landscape statistics directly from comparable games
 * instead of hand-maintaining them, so the two can never drift apart as
 * the fixture (or, later, live Steam data) changes.
 */
export function deriveMarketLandscape(
  games: readonly ComparableGame[],
  referenceYear: number = new Date().getFullYear(),
): MarketLandscape {
  const reviewCounts = games.map((game) => game.totalReviews);
  const medianReviewCount = Math.round(median(reviewCounts));
  const recentCount = games.filter(
    (game) => referenceYear - game.releaseYear < RECENT_RELEASE_WINDOW_YEARS,
  ).length;

  return {
    density: deriveMarketDensity(medianReviewCount),
    averagePositiveRatio: average(games.map((game) => game.positiveRatio)),
    comparableTitles: games.length,
    medianReviewCount,
    recentReleaseRatio: `${recentCount} / ${games.length}`,
  };
}

interface ThemesBySentiment {
  readonly positive: readonly ReviewTheme[];
  readonly complaint: readonly ReviewTheme[];
}

/** Splits themes into the two columns the Player Voice section renders. */
export function groupThemesBySentiment(
  themes: readonly ReviewTheme[],
): ThemesBySentiment {
  return {
    positive: themes.filter((theme) => theme.sentiment === "positive"),
    complaint: themes.filter((theme) => theme.sentiment === "complaint"),
  };
}

/** The evidence reviews backing a single theme (and, by extension, any opportunity derived from it). */
export function getEvidenceForTheme(
  evidence: readonly EvidenceReview[],
  themeId: string,
): readonly EvidenceReview[] {
  return evidence.filter((review) => review.themeId === themeId);
}
