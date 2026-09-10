/**
 * Central, typed source of truth for product identity and primary
 * navigation. Kept out of components so header/footer/metadata stay in
 * sync without duplicating copy across the app.
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "GameLens";

export const APP_TAGLINE =
  "Know what players want before you build it.";

export const APP_DESCRIPTION =
  "Turn your game idea into evidence-backed market intelligence from real Steam players.";

/** Canonical site origin for metadata absolute URLs (OG, etc.). */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

if (
  process.env.NODE_ENV === "production" &&
  /localhost|127\.0\.0\.1/i.test(APP_URL)
) {
  console.warn(
    "[site-config] NEXT_PUBLIC_APP_URL is missing or still points at localhost; Open Graph absolute URLs will be wrong in production.",
  );
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const DEMO_ANALYSIS_PATH = "/analysis/demo";

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Demo", href: DEMO_ANALYSIS_PATH },
];
