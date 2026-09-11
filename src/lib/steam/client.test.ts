import { afterEach, describe, expect, it, vi } from "vitest";

import { buildSteamReviewsUrl, fetchSteamReviews } from "@/lib/steam/client";

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

const VALID_STEAM_RESPONSE = {
  success: 1,
  query_summary: {
    review_score: 8,
    review_score_desc: "Very Positive",
    total_positive: 900,
    total_negative: 100,
    total_reviews: 1000,
  },
  reviews: [
    {
      recommendationid: "1",
      author: { steamid: "765000001", playtime_forever: 120 },
      language: "english",
      review: "Great co-op game.",
      timestamp_created: 1_700_000_000,
      voted_up: true,
      votes_up: 5,
      votes_funny: 0,
      weighted_vote_score: "0.5",
      steam_purchase: true,
      received_for_free: false,
    },
  ],
  cursor: "AoJw abc",
};

describe("buildSteamReviewsUrl", () => {
  it("includes the required Steam query parameters", () => {
    const url = new URL(buildSteamReviewsUrl({ appId: 648_800 }));

    expect(url.pathname).toBe("/appreviews/648800");
    expect(url.searchParams.get("json")).toBe("1");
    expect(url.searchParams.get("filter")).toBe("recent");
    expect(url.searchParams.get("language")).toBe("english");
    expect(url.searchParams.get("num_per_page")).toBe("100");
    expect(url.searchParams.get("cursor")).toBe("*");
  });

  it("defaults an empty cursor to the initial Steam page marker", () => {
    const url = new URL(buildSteamReviewsUrl({ appId: 648_800, cursor: "" }));
    expect(url.searchParams.get("cursor")).toBe("*");
  });

  it("forwards optional params when provided", () => {
    const url = new URL(
      buildSteamReviewsUrl({
        appId: 648_800,
        cursor: "AoJw",
        reviewType: "positive",
        purchaseType: "steam",
        language: "spanish",
        numPerPage: 20,
      }),
    );

    expect(url.searchParams.get("cursor")).toBe("AoJw");
    expect(url.searchParams.get("review_type")).toBe("positive");
    expect(url.searchParams.get("purchase_type")).toBe("steam");
    expect(url.searchParams.get("language")).toBe("spanish");
    expect(url.searchParams.get("num_per_page")).toBe("20");
  });
});

describe("fetchSteamReviews", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects a non-positive app id without making a network request", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchSteamReviews({ appId: -1 });

    expect(result).toEqual({
      success: false,
      error: { code: "INVALID_APP_ID", message: expect.any(String) },
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("normalizes and returns reviews on a successful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(VALID_STEAM_RESPONSE)));

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("expected success");
    expect(result.data.reviews).toHaveLength(1);
    expect(result.data.reviews[0]?.recommendationId).toBe("1");
    expect(result.data.summary?.totalReviews).toBe(1000);
    expect(result.data.cursor).toBe("AoJw abc");
  });

  it("returns a null summary when query_summary is omitted", async () => {
    const withoutSummary = {
      success: VALID_STEAM_RESPONSE.success,
      reviews: VALID_STEAM_RESPONSE.reviews,
      cursor: VALID_STEAM_RESPONSE.cursor,
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(withoutSummary)));

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("expected success");
    expect(result.data.summary).toBeNull();
  });

  it("dedupes reviews that share a recommendation id", async () => {
    const duplicate = {
      ...VALID_STEAM_RESPONSE.reviews[0],
      votes_up: 99,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          ...VALID_STEAM_RESPONSE,
          reviews: [VALID_STEAM_RESPONSE.reviews[0], duplicate],
        }),
      ),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("expected success");
    expect(result.data.reviews).toHaveLength(1);
    expect(result.data.reviews[0]?.votesUp).toBe(5);
  });

  it("reports STEAM_UPSTREAM_ERROR for a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_UPSTREAM_ERROR", message: expect.any(String) },
    });
  });

  it("reports STEAM_MALFORMED_RESPONSE when the body isn't valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not json", { status: 200 })),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_MALFORMED_RESPONSE", message: expect.any(String) },
    });
  });

  it("reports STEAM_MALFORMED_RESPONSE when the JSON doesn't match Steam's shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ unexpected: true })),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_MALFORMED_RESPONSE", message: expect.any(String) },
    });
  });

  it("reports STEAM_UPSTREAM_ERROR when Steam's own success flag is not 1", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ success: 2, reviews: [] })),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_UPSTREAM_ERROR", message: expect.any(String) },
    });
  });

  it("reports STEAM_TIMEOUT when the request is aborted", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        const abortError = new Error("The operation was aborted.");
        abortError.name = "AbortError";
        return Promise.reject(abortError);
      }),
    );

    const result = await fetchSteamReviews({ appId: 648_800 });

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_TIMEOUT", message: expect.any(String) },
    });
  });

  it("skips the network when the caller signal is already aborted", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const caller = new AbortController();
    caller.abort();

    const result = await fetchSteamReviews({ appId: 648_800, signal: caller.signal });

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.error.code).toBe("STEAM_UPSTREAM_ERROR");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports STEAM_UPSTREAM_ERROR when the caller aborts the request", async () => {
    const caller = new AbortController();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const abortError = new Error("The operation was aborted.");
            abortError.name = "AbortError";
            reject(abortError);
          });
        });
      }),
    );

    const pending = fetchSteamReviews({ appId: 648_800, signal: caller.signal });
    caller.abort();
    const result = await pending;

    expect(result).toEqual({
      success: false,
      error: { code: "STEAM_UPSTREAM_ERROR", message: expect.any(String) },
    });
  });
});
