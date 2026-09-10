import { ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { EvidenceReview } from "@/lib/analysis/types";

interface EvidenceReviewCardProps {
  review: EvidenceReview;
}

export function EvidenceReviewCard({ review }: EvidenceReviewCardProps) {
  return (
    <article className="rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground">
          {review.gameName}
        </span>
        <Badge variant={review.sentiment === "positive" ? "positive" : "negative"}>
          {review.sentiment === "positive" ? "Positive" : "Negative"}
        </Badge>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {review.playtimeHours}h playtime
      </p>

      <p className="mt-3 text-sm leading-relaxed text-foreground">
        &ldquo;{review.reviewText}&rdquo;
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="size-3" aria-hidden="true" />
          {review.helpfulVotes} helpful
        </span>
        {review.steamPurchase && <Badge variant="neutral">Steam Purchase</Badge>}
      </div>
    </article>
  );
}
