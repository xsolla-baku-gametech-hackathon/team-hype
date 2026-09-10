import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GameCover } from "@/components/games/game-cover";
import { Badge } from "@/components/ui/badge";
import {
  formatCompactNumber,
  formatPercentage,
} from "@/lib/utils/format";
import type { ComparableGame } from "@/lib/analysis/types";

interface CompetitorCardProps {
  game: ComparableGame;
}

export function CompetitorCard({ game }: CompetitorCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface print:break-inside-avoid">
      <GameCover appId={game.appId} name={game.name} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">
            {game.name}
          </h3>
          <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-accent">
            {formatPercentage(game.similarity)}
            <span className="block text-[10px] font-normal text-muted-foreground">
              match
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="tabular-nums">
            {formatCompactNumber(game.totalReviews)} reviews
          </span>
          <span className="text-positive tabular-nums">
            {formatPercentage(game.positiveRatio)} positive
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {game.genres.map((genre) => (
            <Badge key={genre} variant="neutral">
              {genre}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            Released {game.releaseYear}
          </span>
          <Link
            href="#player-voice"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View Player Insights
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
