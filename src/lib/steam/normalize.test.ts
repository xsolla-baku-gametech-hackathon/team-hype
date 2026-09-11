import { describe, expect, it } from "vitest";

import { dedupeReviews, normalizeSteamReview, normalizeSteamSummary } from "@/lib/steam/normalize";
import type { RawSteamReview, SteamQuerySummary, SteamReview } from "@/lib/steam/types";

function buildRawReview(overrides: Partial<RawSteamReview> = {}): RawSteamReview {
  return {
    recommendationid: "1",
    author: { steamid: "76500000000000001", playtime_forever: 120 },
    language: "english",
    review: "Great co-op game.",
    timestamp_created: 1_700_000_000,
    voted_up: true,
    votes_up: 5,
    votes_funny: 0,
    weighted_vote_score: "0.520000000",
    steam_purchase: true,
    received_for_free: false,
    ...overrides,
  };
}

function buildReview(overrides: Partial<SteamReview> = {}): SteamReview {
  return {
    recommendationId: "1",
    review: "Great co-op game.",
    votedUp: true,
    votesUp: 5,
    votesFunny: 0,
    weightedVoteScore: 0.52,
    language: "english",
    steamPurchase: true,
    receivedForFree: false,
    timestampCreated: 1_700_000_000,
    playtimeForever: 120,
    playtimeAtReview: 120,
    ...overrides,
  };
}

describe("normalizeSteamReview", () => {
  it("maps snake_case fields to the camelCase domain shape", () => {
    const raw = buildRawReview();

    expect(normalizeSteamReview(raw)).toEqual(buildReview());
  });

  it("parses weightedVoteScore when Steam sends a numeric string", () => {
    const raw = buildRawReview({ weighted_vote_score: "0.987654321" });

    expect(normalizeSteamReview(raw).weightedVoteScore).toBeCloseTo(0.987654321);
  });

  it("accepts weightedVoteScore when Steam sends a plain number", () => {
    const raw = buildRawReview({ weighted_vote_score: 0.5 });

    expect(normalizeSteamReview(raw).weightedVoteScore).toBe(0.5);
  });

  it("falls back to zero when weighted_vote_score is not a finite number", () => {
    const raw = buildRawReview({ weighted_vote_score: "not-a-number" });

    expect(normalizeSteamReview(raw).weightedVoteScore).toBe(0);
  });

  it("falls back to lifetime playtime when playtimeAtReview is missing", () => {
    const raw = buildRawReview({
      author: { steamid: "76500000000000001", playtime_forever: 340 },
    });

    expect(normalizeSteamReview(raw).playtimeAtReview).toBe(340);
  });

  it("prefers the review-time playtime when Steam provides it", () => {
    const raw = buildRawReview({
      author: {
        steamid: "76500000000000001",
        playtime_forever: 340,
        playtime_at_review: 210,
      },
    });

    expect(normalizeSteamReview(raw).playtimeAtReview).toBe(210);
  });
});

describe("normalizeSteamSummary", () => {
  it("maps snake_case query_summary fields to the camelCase domain shape", () => {
    const raw: SteamQuerySummary = {
      review_score: 8,
      review_score_desc: "Very Positive",
      total_positive: 900,
      total_negative: 100,
      total_reviews: 1000,
    };

    expect(normalizeSteamSummary(raw)).toEqual({
      reviewScore: 8,
      reviewScoreDescription: "Very Positive",
      totalPositive: 900,
      totalNegative: 100,
      totalReviews: 1000,
    });
  });
});

describe("dedupeReviews", () => {
  it("removes reviews with a repeated recommendationId", () => {
    const reviews = [
      buildReview({ recommendationId: "1" }),
      buildReview({ recommendationId: "2" }),
      buildReview({ recommendationId: "1" }),
    ];

    const result = dedupeReviews(reviews);

    expect(result).toHaveLength(2);
    expect(result.map((review) => review.recommendationId)).toEqual(["1", "2"]);
  });

  it("preserves order and keeps the first occurrence of a duplicate", () => {
    const first = buildReview({ recommendationId: "1", votesUp: 1 });
    const duplicate = buildReview({ recommendationId: "1", votesUp: 99 });

    const result = dedupeReviews([first, duplicate]);

    expect(result).toEqual([first]);
  });

  it("returns an empty array unchanged", () => {
    expect(dedupeReviews([])).toEqual([]);
  });
});
