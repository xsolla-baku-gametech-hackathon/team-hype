import { ViewEvidenceButton } from "@/components/evidence/view-evidence-button";
import { Badge } from "@/components/ui/badge";
import { CONFIDENCE_LABEL } from "@/lib/analysis/labels";
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
    <article className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-surface p-6 panel-bevel print:break-inside-avoid sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-accent via-accent/40 to-transparent"
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-display shrink-0 text-3xl font-semibold tabular-nums text-accent/35">
            #{opportunity.rank}
          </span>
          <h3 className="min-w-0 text-lg font-semibold text-pretty text-foreground">
            {opportunity.title}
          </h3>
        </div>
        <Badge variant={opportunity.confidence === "high" ? "opportunity" : "neutral"}>
          {CONFIDENCE_LABEL[opportunity.confidence]}
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
          <div key={detail.label} className="rounded-lg bg-black/20 px-3 py-3">
            <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
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
