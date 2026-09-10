import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import type { MarketOpportunity } from "@/lib/analysis/types";

interface OpportunityListProps {
  opportunities: readonly MarketOpportunity[];
}

/** A vertical, editorial list — opportunities are read top-to-bottom by rank, not scanned like a card grid. */
export function OpportunityList({ opportunities }: OpportunityListProps) {
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
