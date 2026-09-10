import { ThemeBar } from "@/components/insights/theme-bar";
import { formatNumber } from "@/lib/utils/format";
import type { ConfidenceLevel, ReviewTheme } from "@/lib/analysis/types";

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

interface ThemeCardProps {
  theme: ReviewTheme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const sentimentColor =
    theme.sentiment === "positive" ? "text-positive" : "text-negative";

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-medium text-foreground">{theme.label}</h4>
        <span className={`text-lg font-semibold tabular-nums ${sentimentColor}`}>
          {theme.percentage}%
        </span>
      </div>

      <div className="mt-3">
        <ThemeBar percentage={theme.percentage} sentiment={theme.sentiment} />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {formatNumber(theme.reviewCount)} reviews
        </span>
        <span className="tabular-nums">
          {theme.gamesFoundIn} / {theme.gamesTotal} games
        </span>
        <span>{CONFIDENCE_LABEL[theme.confidence]}</span>
      </div>
    </div>
  );
}
