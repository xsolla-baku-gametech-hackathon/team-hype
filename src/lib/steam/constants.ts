/**
 * Base URL for the Steam Storefront review API. Configurable via env so
 * a mock/proxy endpoint can stand in during local development or CI
 * without touching any code.
 */
const DEFAULT_STEAM_BASE_URL = "https://store.steampowered.com";

const ALLOWED_STEAM_HOSTS = new Set([
  "store.steampowered.com",
  "localhost",
  "127.0.0.1",
]);

function resolveSteamBaseUrl(raw: string | undefined): string {
  const candidate = (raw ?? DEFAULT_STEAM_BASE_URL).trim() || DEFAULT_STEAM_BASE_URL;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      console.warn(
        `[steam] STEAM_BASE_URL must use https (got ${url.protocol}); falling back to default.`,
      );
      return DEFAULT_STEAM_BASE_URL;
    }
    if (!ALLOWED_STEAM_HOSTS.has(url.hostname)) {
      console.warn(
        `[steam] STEAM_BASE_URL host "${url.hostname}" is not allowlisted; falling back to default.`,
      );
      return DEFAULT_STEAM_BASE_URL;
    }
    return url.origin;
  } catch {
    console.warn("[steam] STEAM_BASE_URL is invalid; falling back to default.");
    return DEFAULT_STEAM_BASE_URL;
  }
}

export const STEAM_BASE_URL = resolveSteamBaseUrl(process.env.STEAM_BASE_URL);

/** Steam occasionally hangs rather than erroring — bail out rather than blocking the analysis flow. */
export const STEAM_REQUEST_TIMEOUT_MS = 8_000;

export const DEFAULT_REVIEWS_PER_PAGE = 100;
export const DEFAULT_REVIEW_LANGUAGE = "english";

/** Subset of Steam storefront review language codes we accept from clients. */
export const STEAM_REVIEW_LANGUAGES = [
  "all",
  "english",
  "spanish",
  "french",
  "german",
  "portuguese",
  "brazilian",
  "russian",
  "schinese",
  "tchinese",
  "japanese",
  "koreana",
] as const;

export type SteamReviewLanguage = (typeof STEAM_REVIEW_LANGUAGES)[number];

export const STEAM_REVIEW_TYPES = ["all", "positive", "negative"] as const;
export type SteamReviewType = (typeof STEAM_REVIEW_TYPES)[number];

export const STEAM_PURCHASE_TYPES = ["all", "steam", "non_steam_purchase"] as const;
export type SteamPurchaseType = (typeof STEAM_PURCHASE_TYPES)[number];
