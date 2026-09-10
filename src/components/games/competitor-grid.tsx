import { CompetitorCard } from "@/components/games/competitor-card";
import type { ComparableGame } from "@/lib/analysis/types";

interface CompetitorGridProps {
  games: readonly ComparableGame[];
}

export function CompetitorGrid({ games }: CompetitorGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {games.map((game) => (
        <CompetitorCard key={game.appId} game={game} />
      ))}
    </div>
  );
}
