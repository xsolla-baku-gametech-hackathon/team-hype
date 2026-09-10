import {
  DEFAULT_REVIEW_LANGUAGE,
  DEFAULT_REVIEWS_PER_PAGE,
  STEAM_BASE_URL,
  STEAM_REQUEST_TIMEOUT_MS,
} from "@/lib/steam/constants";
import { dedupeReviews, normalizeSteamReview, normalizeSteamSummary } from "@/lib/steam/normalize";
import {
  steamReviewsResponseSchema,
  type FetchSteamReviewsParams,
  type SteamClientResult,
  type SteamReviewPage,
  type SteamReviewSummary,
} from "@/lib/steam/types";

/** Exported for tests — pure and network-free. */
export function buildSteamReviewsUrl(params: FetchSteamReviewsParams): string {
  const url = new URL(`/appreviews/${params.appId}`, STEAM_BASE_URL);

  url.searchParams.set("json", "1");
  url.searchParams.set("filter", "recent");
  url.searchParams.set("language", params.language ?? DEFAULT_REVIEW_LANGUAGE);
  url.searchParams.set(
    "num_per_page",
    String(params.numPerPage ?? DEFAULT_REVIEWS_PER_PAGE),
  );
  url.searchParams.set("cursor", params.cursor ?? "*");
  url.searchParams.set("review_type", params.reviewType ?? "all");
  url.searchParams.set("purchase_type", params.purchaseType ?? "all");

  return url.toString();
}

function isValidAppId(appId: number): boolean {
  return Number.isInteger(appId) && appId > 0;
}

/**
 * Fetches one page of Steam reviews for an app id. Never throws —
 * network failures, timeouts, malformed JSON, and Steam-side errors are
 * all reported through the `success: false` branch so callers (route
 * handlers, the demo fallback) can handle them uniformly.
 */
export async function fetchSteamReviews(
  params: FetchSteamReviewsParams,
): Promise<SteamClientResult<SteamReviewPage>> {
  if (!isValidAppId(params.appId)) {
    return {
      success: false,
      error: {
        code: "INVALID_APP_ID",
        message: `"${params.appId}" is not a valid Steam app id.`,
      },
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STEAM_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(buildSteamReviewsUrl(params), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    const isAbort = cause instanceof Error && cause.name === "AbortError";
    return {
      success: false,
      error: isAbort
        ? { code: "STEAM_TIMEOUT", message: "Steam took too long to respond." }
        : { code: "STEAM_UPSTREAM_ERROR", message: "Unable to reach Steam." },
    };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    return {
      success: false,
      error: {
        code: "STEAM_UPSTREAM_ERROR",
        message: `Steam responded with status ${response.status}.`,
      },
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return {
      success: false,
      error: {
        code: "STEAM_MALFORMED_RESPONSE",
        message: "Steam returned a response that could not be parsed.",
      },
    };
  }

  const parsed = steamReviewsResponseSchema.safeParse(json);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "STEAM_MALFORMED_RESPONSE",
        message: "Steam's response did not match the expected shape.",
      },
    };
  }

  if (parsed.data.success !== 1) {
    return {
      success: false,
      error: {
        code: "STEAM_UPSTREAM_ERROR",
        message: "Steam could not process this app id.",
      },
    };
  }

  const reviews = dedupeReviews(parsed.data.reviews.map(normalizeSteamReview));

  return {
    success: true,
    data: {
      reviews,
      cursor: parsed.data.cursor ?? "*",
      summary: parsed.data.query_summary
        ? normalizeSteamSummary(parsed.data.query_summary)
        : null,
    },
  };
}

/**
 * A single review's worth of payload is enough to read Steam's
 * `query_summary` block, so this avoids pulling a full page just to
 * report aggregate totals (e.g. for a competitor card tooltip).
 */
export async function fetchSteamReviewSummary(
  appId: number,
): Promise<SteamClientResult<SteamReviewSummary>> {
  const result = await fetchSteamReviews({ appId, numPerPage: 1 });

  if (!result.success) return result;

  if (!result.data.summary) {
    return {
      success: false,
      error: {
        code: "STEAM_UPSTREAM_ERROR",
        message: "Steam did not return a review summary for this app id.",
      },
    };
  }

  return { success: true, data: result.data.summary };
}
