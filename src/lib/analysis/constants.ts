import type { Genre, Platform } from "@/lib/analysis/types";

export const CONCEPT_PLACEHOLDER =
  "A cooperative survival game where players manage a moving train, gather resources during stops, and upgrade the train together.";

interface SelectOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export const PLATFORM_OPTIONS: readonly SelectOption<Platform>[] = [
  { value: "pc", label: "PC" },
  { value: "console", label: "Console" },
  { value: "mobile", label: "Mobile" },
];

export const GENRE_OPTIONS: readonly SelectOption<Genre>[] = [
  { value: "survival", label: "Survival" },
  { value: "coop", label: "Co-op" },
  { value: "crafting", label: "Crafting" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "simulation", label: "Simulation" },
  { value: "strategy", label: "Strategy" },
  { value: "rpg", label: "RPG" },
  { value: "shooter", label: "Shooter" },
  { value: "other", label: "Other" },
];

export interface AnalysisStage {
  readonly id: string;
  readonly label: string;
  /** Simulated duration for the mock progress screen, in milliseconds. */
  readonly durationMs: number;
}

/**
 * Ordered stages shown on the analysis loading screen. Durations sum to
 * roughly 3.5s — fast enough to stay comfortable in a live demo while
 * still reading as real work being done.
 */
export const ANALYSIS_STAGES: readonly AnalysisStage[] = [
  { id: "understand-concept", label: "Understanding your concept", durationMs: 500 },
  { id: "find-comparables", label: "Finding comparable games", durationMs: 900 },
  { id: "read-feedback", label: "Reading player feedback", durationMs: 900 },
  { id: "detect-patterns", label: "Detecting recurring patterns", durationMs: 700 },
  { id: "find-opportunities", label: "Finding market opportunities", durationMs: 600 },
];
