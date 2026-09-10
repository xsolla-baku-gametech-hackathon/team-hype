import { z } from "zod";

/**
 * Domain types for a developer's game concept submission. Kept separate
 * from `lib/analysis` mock/report types (added in a later stage) since a
 * concept is user input, not analysis output.
 */

export const PLATFORMS = ["pc", "console", "mobile"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const GENRES = [
  "survival",
  "coop",
  "crafting",
  "action",
  "adventure",
  "simulation",
  "strategy",
  "rpg",
  "shooter",
  "other",
] as const;
export type Genre = (typeof GENRES)[number];

/**
 * Validated against `conceptFormSchema` before an analysis is requested.
 * Platform and genre are optional — the concept description alone is
 * enough to find comparable games.
 */
export interface ConceptFormValues {
  concept: string;
  platform?: Platform;
  genre?: Genre;
}

export const conceptFormSchema = z.object({
  concept: z
    .string()
    .trim()
    .min(30, "Add a bit more detail so we can find comparable games.")
    .max(2000, "Keep the concept under 2000 characters."),
  platform: z.enum(PLATFORMS).optional(),
  genre: z.enum(GENRES).optional(),
});
