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
