import { cn } from "@/lib/utils/cn";
import type { ReviewSentiment } from "@/lib/analysis/types";

interface ThemeBarProps {
  percentage: number;
  sentiment: ReviewSentiment;
}

/** A restrained fill bar — the only chart the Player Voice section needs. */
export function ThemeBar({ percentage, sentiment }: ThemeBarProps) {
  return (
    <div
      role="meter"
      aria-label={`${percentage}% ${sentiment} theme coverage`}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover"
    >
      <div
        className={cn(
          "h-full rounded-full",
          sentiment === "positive" ? "bg-positive" : "bg-negative",
        )}
      style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}
