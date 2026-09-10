import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import type { MarketOpportunity } from "@/lib/analysis/types";

interface OpportunityListProps {
  opportunities: readonly MarketOpportunity[];
}

/** A vertical, editorial list — opportunities are read top-to-bottom by rank, not scanned like a card grid. */
export function OpportunityList({ opportunities }: OpportunityListProps) {
  return (
    <div className="flex flex-col gap-4">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
