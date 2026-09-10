/**
 * Steam serves a predictable header image for every app id, so the URL
 * is derived rather than stored on `ComparableGame` — one less field
 * that could drift out of sync with the real store listing.
 *
 * Keep `STEAM_CDN_HOSTNAME` in sync with the `images.remotePatterns`
 * entry in `next.config.ts`.
 */
export const STEAM_CDN_HOSTNAME = "cdn.akamai.steamstatic.com";

export function getSteamHeaderImageUrl(appId: number): string {
  return `https://${STEAM_CDN_HOSTNAME}/steam/apps/${appId}/header.jpg`;
}
