import { ThemeBar } from "@/components/insights/theme-bar";
import { ViewEvidenceButton } from "@/components/evidence/view-evidence-button";
import { CONFIDENCE_LABEL } from "@/lib/analysis/labels";
import { formatNumber } from "@/lib/utils/format";
import type { ReviewTheme } from "@/lib/analysis/types";

interface ThemeCardProps {
  theme: ReviewTheme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const sentimentColor =
    theme.sentiment === "positive" ? "text-positive" : "text-negative";

  return (
    <article className="rounded-xl border border-white/[0.08] bg-surface p-4 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/16 print:break-inside-avoid">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-medium text-foreground">{theme.label}</h4>
        <span className={`font-display text-lg font-semibold tabular-nums ${sentimentColor}`}>
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

      <ViewEvidenceButton
        themeId={theme.id}
        variant="outline"
        size="sm"
        className="mt-4 w-full"
      />
    </article>
  );
}
