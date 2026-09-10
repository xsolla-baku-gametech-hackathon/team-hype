import { z } from "zod";

import {
  STEAM_PURCHASE_TYPES,
  STEAM_REVIEW_LANGUAGES,
  STEAM_REVIEW_TYPES,
  type SteamPurchaseType,
  type SteamReviewType,
} from "@/lib/steam/constants";

/**
 * Raw Steam `appreviews` response, validated with Zod rather than typed
 * with `any`/`as` — Steam's API is undocumented and unversioned, so
 * anything it sends is `unknown` until it passes this schema.
 */
const steamAuthorSchema = z.object({
  steamid: z.string(),
  playtime_forever: z.number(),
  playtime_at_review: z.number().optional(),
});

const rawSteamReviewSchema = z.object({
  recommendationid: z.string(),
  author: steamAuthorSchema,
  language: z.string(),
  review: z.string(),
  timestamp_created: z.number(),
  voted_up: z.boolean(),
  votes_up: z.number(),
  votes_funny: z.number(),
  // Observed as both a numeric string (e.g. "0.520000000") and a plain
  // number depending on the review — Steam's API is undocumented, so
  // both are accepted rather than trusting one shape.
  weighted_vote_score: z.union([z.string(), z.number()]),
  steam_purchase: z.boolean(),
  received_for_free: z.boolean(),
});

const steamQuerySummarySchema = z.object({
  review_score: z.number(),
  review_score_desc: z.string(),
  total_positive: z.number(),
  total_negative: z.number(),
  total_reviews: z.number(),
});

export const steamReviewsResponseSchema = z.object({
  // 1 on success; Steam has been observed to send other values (or omit
  // the field) for invalid/removed app ids.
  success: z.number(),
  query_summary: steamQuerySummarySchema.optional(),
  reviews: z.array(rawSteamReviewSchema).optional().default([]),
  cursor: z.string().optional(),
});

export type RawSteamReview = z.infer<typeof rawSteamReviewSchema>;
export type SteamQuerySummary = z.infer<typeof steamQuerySummarySchema>;
export type SteamReviewsResponse = z.infer<typeof steamReviewsResponseSchema>;

/**
 * Normalized review shape used throughout the app — camelCase, with
 * `weightedVoteScore` parsed to a number. Mirrors `EvidenceReview`'s
 * spirit closely enough that real reviews can flow into the same UI.
 */
export interface SteamReview {
  readonly recommendationId: string;
  readonly review: string;
  readonly votedUp: boolean;
  readonly votesUp: number;
  readonly votesFunny: number;
  readonly weightedVoteScore: number;
  readonly language: string;
  readonly steamPurchase: boolean;
  readonly receivedForFree: boolean;
  readonly timestampCreated: number;
  readonly playtimeForever: number;
  readonly playtimeAtReview: number;
}

export interface SteamReviewSummary {
  readonly totalReviews: number;
  readonly totalPositive: number;
  readonly totalNegative: number;
  readonly reviewScore: number;
  readonly reviewScoreDescription: string;
}

export interface SteamReviewPage {
  readonly reviews: readonly SteamReview[];
  readonly cursor: string;
  readonly summary: SteamReviewSummary | null;
}

export interface FetchSteamReviewsParams {
  readonly appId: number;
  readonly cursor?: string;
  readonly reviewType?: SteamReviewType;
  readonly purchaseType?: SteamPurchaseType;
  readonly language?: SteamReviewLanguage;
  readonly numPerPage?: number;
}

export type SteamClientErrorCode =
  | "INVALID_APP_ID"
  | "STEAM_TIMEOUT"
  | "STEAM_UPSTREAM_ERROR"
  | "STEAM_MALFORMED_RESPONSE";

export interface SteamClientError {
  readonly code: SteamClientErrorCode;
  readonly message: string;
}

export type SteamClientResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: SteamClientError };

export const requestReviewsQuerySchema = z.object({
  cursor: z.string().optional(),
  reviewType: z.enum(STEAM_REVIEW_TYPES).optional(),
  purchaseType: z.enum(STEAM_PURCHASE_TYPES).optional(),
  language: z.enum(STEAM_REVIEW_LANGUAGES).optional(),
});
