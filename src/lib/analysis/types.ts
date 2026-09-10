import { z } from "zod";

/**
 * Domain types for a developer's game concept submission. Kept separate
 * from `lib/analysis` mock/report types (added in a later stage) since a
 * concept is user input, not analysis output.
 */

export const PLATFORMS = ["pc", "console", "mobile"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const GENRES = [
  "survival",
  "coop",
  "crafting",
  "action",
  "adventure",
  "simulation",
  "strategy",
  "rpg",
  "shooter",
  "other",
] as const;
export type Genre = (typeof GENRES)[number];

/**
 * Validated against `conceptFormSchema` before an analysis is requested.
 * Platform and genre are optional — the concept description alone is
 * enough to find comparable games.
 */
export interface ConceptFormValues {
  concept: string;
  platform?: Platform;
  genre?: Genre;
}

export const conceptFormSchema = z.object({
  concept: z
    .string()
    .trim()
    .min(30, "Add a bit more detail so we can find comparable games.")
    .max(2000, "Keep the concept under 2000 characters."),
  platform: z.enum(PLATFORMS).optional(),
  genre: z.enum(GENRES).optional(),
});

/**
 * Analysis report domain model.
 *
 * This shape is intentionally what a real pipeline would eventually
 * produce (semantic search + review mining + LLM synthesis), so the mock
 * fixture in `mock-data.ts` can be swapped for a live data source without
 * changing any component below the report page.
 */

export interface ComparableGame {
  readonly appId: number;
  readonly name: string;
  /** 0–1 semantic similarity to the submitted concept. */
  readonly similarity: number;
  readonly totalReviews: number;
  /** 0–1 share of all-time reviews that are positive. */
  readonly positiveRatio: number;
  readonly genres: readonly string[];
  readonly releaseYear: number;
  readonly price: string;
}

export type ReviewSentiment = "positive" | "complaint";
export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * A recurring pattern mined from player reviews across comparable games.
 * `percentage` is the share of analyzed reviews that mention the theme —
 * themes are not mutually exclusive, so values are not expected to sum
 * to 100 within a sentiment group.
 */
export interface ReviewTheme {
  readonly id: string;
  readonly sentiment: ReviewSentiment;
  readonly label: string;
  readonly percentage: number;
  readonly reviewCount: number;
  readonly gamesFoundIn: number;
  readonly gamesTotal: number;
  readonly confidence: ConfidenceLevel;
}

/**
 * A ranked, evidence-backed recommendation derived from one or more
 * complaint/positive themes. `relatedThemeId` links back to the theme
 * (and therefore the evidence reviews) it was synthesized from.
 */
export interface MarketOpportunity {
  readonly id: string;
  readonly rank: number;
  readonly title: string;
  readonly confidence: ConfidenceLevel;
  readonly gamesFoundIn: number;
  readonly gamesTotal: number;
  readonly evidenceReviewCount: number;
  readonly whyItMatters: string;
  readonly opportunity: string;
  readonly recommendation: string;
  readonly relatedThemeId: string;
}

/**
 * A single player review surfaced as evidence for a theme/opportunity.
 * Shares its shape with the normalized Steam review type (added when the
 * real review client lands) so mock and live evidence render identically.
 */
export interface EvidenceReview {
  readonly id: string;
  readonly gameName: string;
  readonly sentiment: "positive" | "negative";
  readonly playtimeHours: number;
  readonly reviewText: string;
  readonly helpfulVotes: number;
  readonly steamPurchase: boolean;
  readonly themeId: string;
}

export interface AnalysisSummaryMetrics {
  readonly comparableGamesCount: number;
  /** Individual review texts mined by the pipeline — a sample, not every review Steam has ever recorded. */
  readonly reviewsAnalyzedCount: number;
  /** Total distinct patterns detected; `themes` below surfaces only the top ones. */
  readonly recurringThemesDetected: number;
  readonly marketOpportunitiesCount: number;
}

export type MarketDensity = "low" | "moderate" | "high";

export interface MarketLandscape {
  readonly density: MarketDensity;
  readonly averagePositiveRatio: number;
  readonly comparableTitles: number;
  readonly medianReviewCount: number;
  /** e.g. "5 / 8" — titles released within the recency window. */
  readonly recentReleaseRatio: string;
}

export interface AnalysisReport {
  readonly id: string;
  readonly concept: string;
  readonly platform?: Platform;
  readonly genre?: Genre;
  readonly createdAt: string;
  readonly summary: AnalysisSummaryMetrics;
  readonly executiveSummary: string;
  readonly comparableGames: readonly ComparableGame[];
  readonly themes: readonly ReviewTheme[];
  readonly opportunities: readonly MarketOpportunity[];
  readonly evidence: readonly EvidenceReview[];
  readonly marketLandscape: MarketLandscape;
}
