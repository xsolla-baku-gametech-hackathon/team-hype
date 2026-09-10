import type {
  RawSteamReview,
  SteamQuerySummary,
  SteamReview,
  SteamReviewSummary,
} from "@/lib/steam/types";

export function normalizeSteamReview(raw: RawSteamReview): SteamReview {
  return {
    recommendationId: raw.recommendationid,
    review: raw.review,
    votedUp: raw.voted_up,
    votesUp: raw.votes_up,
    votesFunny: raw.votes_funny,
    weightedVoteScore: (() => {
      const parsed =
        typeof raw.weighted_vote_score === "number"
          ? raw.weighted_vote_score
          : Number.parseFloat(raw.weighted_vote_score);
      return Number.isFinite(parsed) ? parsed : 0;
    })(),
    language: raw.language,
    steamPurchase: raw.steam_purchase,
    receivedForFree: raw.received_for_free,
    timestampCreated: raw.timestamp_created,
    playtimeForever: raw.author.playtime_forever,
    // Steam omits this for very old reviews predating the field; falling
    // back to lifetime playtime is the closest honest approximation.
    playtimeAtReview: raw.author.playtime_at_review ?? raw.author.playtime_forever,
  };
}

export function normalizeSteamSummary(raw: SteamQuerySummary): SteamReviewSummary {
  return {
    totalReviews: raw.total_reviews,
    totalPositive: raw.total_positive,
    totalNegative: raw.total_negative,
    reviewScore: raw.review_score,
    reviewScoreDescription: raw.review_score_desc,
  };
}

/**
 * Steam repeats the final page's reviews if a cursor is requested past
 * the end of the result set, so pagination that keeps fetching "until
 * empty" can otherwise loop forever collecting duplicates.
 */
export function dedupeReviews(
  reviews: readonly SteamReview[],
): readonly SteamReview[] {
  const seenIds = new Set<string>();
  const deduped: SteamReview[] = [];

  for (const review of reviews) {
    if (seenIds.has(review.recommendationId)) continue;
    seenIds.add(review.recommendationId);
    deduped.push(review);
  }

  return deduped;
}
