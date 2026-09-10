import { ViewEvidenceButton } from "@/components/evidence/view-evidence-button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import type { MarketOpportunity } from "@/lib/analysis/types";

interface OpportunityCardProps {
  opportunity: MarketOpportunity;
}

interface DetailField {
  readonly label: string;
  readonly value: string;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const details: readonly DetailField[] = [
    { label: "Why it matters", value: opportunity.whyItMatters },
    { label: "Opportunity", value: opportunity.opportunity },
    { label: "Recommendation", value: opportunity.recommendation },
  ];

  return (
    <article className="rounded-lg border border-border bg-surface p-6 print:break-inside-avoid sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold tabular-nums text-muted-foreground/40">
            #{opportunity.rank}
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            {opportunity.title}
          </h3>
        </div>
        <Badge variant={opportunity.confidence === "high" ? "opportunity" : "neutral"}>
          {opportunity.confidence.toUpperCase()} CONFIDENCE
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>
          Found across{" "}
          <span className="font-medium text-foreground tabular-nums">
            {opportunity.gamesFoundIn} / {opportunity.gamesTotal}
          </span>{" "}
          games
        </span>
        <span>
          Evidence{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatNumber(opportunity.evidenceReviewCount)}
          </span>{" "}
          player reviews
        </span>
      </div>

      <dl className="mt-6 grid gap-5 sm:grid-cols-3">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {detail.label}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-foreground">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>

      <ViewEvidenceButton
        themeId={opportunity.relatedThemeId}
        variant="outline"
        size="sm"
        className="mt-6"
      />
    </article>
  );
}
