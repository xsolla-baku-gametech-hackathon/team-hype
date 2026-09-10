import { formatNumber } from "@/lib/utils/format";
import type { AnalysisSummaryMetrics } from "@/lib/analysis/types";

interface MetricsRowProps {
  summary: AnalysisSummaryMetrics;
}

interface Metric {
  readonly value: number;
  readonly label: string;
}

/** The four top-line numbers every report leads with. */
export function MetricsRow({ summary }: MetricsRowProps) {
  const metrics: readonly Metric[] = [
    { value: summary.comparableGamesCount, label: "Comparable Games" },
    { value: summary.reviewsAnalyzedCount, label: "Reviews Analyzed" },
    { value: summary.recurringThemesDetected, label: "Recurring Themes" },
    { value: summary.marketOpportunitiesCount, label: "Market Opportunities" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-border bg-surface px-4 py-4"
        >
          <dd className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatNumber(metric.value)}
          </dd>
          <dt className="mt-1 text-xs text-muted-foreground">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}
