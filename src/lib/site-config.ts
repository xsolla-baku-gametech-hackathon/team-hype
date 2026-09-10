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

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "How It Works", href: "/#how-it-works" },
];
