import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import type { MarketOpportunity } from "@/lib/analysis/types";

interface OpportunityListProps {
  opportunities: readonly MarketOpportunity[];
}

/** A vertical, editorial list — opportunities are read top-to-bottom by rank, not scanned like a card grid. */
export function OpportunityList({ opportunities }: OpportunityListProps) {
  if (opportunities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No market opportunities were synthesized for this analysis yet.
      </p>
    );
  }

  return (
    <ol className="flex list-none flex-col gap-4 p-0">
      {opportunities.map((opportunity) => (
        <li key={opportunity.id}>
          <OpportunityCard opportunity={opportunity} />
        </li>
      ))}
    </ol>
  );
}
