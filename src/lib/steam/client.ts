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
} from "@/lib/steam/types";

/** Exported for tests — pure and network-free. */
export function buildSteamReviewsUrl(params: FetchSteamReviewsParams): string {
  const url = new URL(`/appreviews/${params.appId}`, STEAM_BASE_URL);

  url.searchParams.set("json", "1");
  url.searchParams.set("filter", "recent");
  url.searchParams.set("language", params.language ?? DEFAULT_REVIEW_LANGUAGE);
  const numPerPage = Math.min(
    100,
    Math.max(1, params.numPerPage ?? DEFAULT_REVIEWS_PER_PAGE),
  );
  url.searchParams.set("num_per_page", String(numPerPage));
  url.searchParams.set("cursor", params.cursor?.trim() || "*");
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

  const onCallerAbort = () => controller.abort();
  if (params.signal) {
    if (params.signal.aborted) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: {
          code: "STEAM_UPSTREAM_ERROR",
          message: "Request was aborted before contacting Steam.",
        },
      };
    }
    params.signal.addEventListener("abort", onCallerAbort, { once: true });
  }

  let response: Response;
  try {
    response = await fetch(buildSteamReviewsUrl(params), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    const isAbort = cause instanceof Error && cause.name === "AbortError";
    const callerAborted = Boolean(params.signal?.aborted);
    return {
      success: false,
      error: isAbort
        ? callerAborted
          ? {
              code: "STEAM_UPSTREAM_ERROR",
              message: "Request was aborted before Steam responded.",
            }
          : { code: "STEAM_TIMEOUT", message: "Steam took too long to respond." }
        : { code: "STEAM_UPSTREAM_ERROR", message: "Unable to reach Steam." },
    };
  } finally {
    clearTimeout(timeoutId);
    params.signal?.removeEventListener("abort", onCallerAbort);
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
