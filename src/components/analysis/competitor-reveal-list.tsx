import { Gamepad2 } from "lucide-react";

import { formatPercentage } from "@/lib/utils/format";
import type { ComparableGame } from "@/lib/analysis/types";

interface CompetitorRevealListProps {
  games: readonly ComparableGame[];
}

/**
 * Lightweight preview shown while the loading screen is still "finding
 * comparable games" — a compact teaser, not the full competitor card
 * (with review stats and genres) that the Competitors section renders
 * once the report is ready.
 */
export function CompetitorRevealList({ games }: CompetitorRevealListProps) {
  if (games.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {games.map((game) => (
        <li
          key={game.appId}
          className="flex animate-in fade-in slide-in-from-bottom-1 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground duration-300"
        >
          <Gamepad2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {game.name}
          <span className="tabular-nums text-accent">
            {formatPercentage(game.similarity)}
          </span>
        </li>
      ))}
    </ul>
  );
}
