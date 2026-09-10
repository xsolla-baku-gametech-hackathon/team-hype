import { CompetitorCard } from "@/components/games/competitor-card";
import type { ComparableGame } from "@/lib/analysis/types";

interface CompetitorGridProps {
  games: readonly ComparableGame[];
}

export function CompetitorGrid({ games }: CompetitorGridProps) {
  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {games.map((game) => (
        <li key={game.appId}>
          <CompetitorCard game={game} />
        </li>
      ))}
    </ul>
  );
}
