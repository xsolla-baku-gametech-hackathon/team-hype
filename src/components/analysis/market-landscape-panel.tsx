import { capitalize, formatCompactNumber, formatPercentage } from "@/lib/utils/format";
import type { MarketLandscape } from "@/lib/analysis/types";

interface MarketLandscapePanelProps {
  landscape: MarketLandscape;
}

interface StatItem {
  readonly label: string;
  readonly value: string;
}

/**
 * Compact secondary stats — deliberately styled smaller than
 * `MetricsRow` so the report keeps one clear visual hierarchy of
 * "headline numbers" vs. "supporting context", instead of two
 * competing sets of large figures.
 */
export function MarketLandscapePanel({ landscape }: MarketLandscapePanelProps) {
  const stats: readonly StatItem[] = [
    { label: "Market density", value: capitalize(landscape.density) },
    {
      label: "Average positive ratio",
      value: formatPercentage(landscape.averagePositiveRatio),
    },
    { label: "Comparable titles", value: String(landscape.comparableTitles) },
    {
      label: "Median review count",
      value: formatCompactNumber(landscape.medianReviewCount),
    },
    { label: "Recent releases", value: landscape.recentReleaseRatio },
  ];

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-4 rounded-lg border border-border bg-surface px-5 py-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="text-sm font-medium tabular-nums text-foreground">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
