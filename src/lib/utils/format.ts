/** Thousands-separated integer, e.g. `2846` → `"2,846"`. */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/** Compact review-count style, e.g. `8200` → `"8.2K"`. */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** `0.87` → `"87%"`. */
export function formatPercentage(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

/** `"moderate"` → `"Moderate"`. For single-word enum-style labels only. */
export function capitalize(value: string): string {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}
