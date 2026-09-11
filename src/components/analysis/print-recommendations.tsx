import { ReportSection } from "@/components/analysis/report-section";
import type { MarketOpportunity } from "@/lib/analysis/types";

interface PrintRecommendationsProps {
  opportunities: readonly MarketOpportunity[];
}

/**
 * The spec's PDF layout (section 20) lists "Recommendations" as its own
 * section, distinct from "Opportunities" — on screen the recommendation
 * is just a field on each opportunity card, so this consolidates that
 * field into a standalone numbered list that only renders when printing.
 */
export function PrintRecommendations({ opportunities }: PrintRecommendationsProps) {
  if (opportunities.length === 0) return null;

  return (
    <div className="hidden print:block">
      <ReportSection id="print-recommendations" title="Recommendations">
        <ol className="flex flex-col gap-3 pl-5 list-decimal">
          {opportunities.map((opportunity) => (
            <li
              key={opportunity.id}
              className="text-sm leading-relaxed text-foreground"
            >
              <span className="font-medium">{opportunity.title}.</span>{" "}
              {opportunity.recommendation}
            </li>
          ))}
        </ol>
      </ReportSection>
    </div>
  );
}
