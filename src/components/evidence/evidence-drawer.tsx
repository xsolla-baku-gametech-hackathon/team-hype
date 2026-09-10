"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EvidenceReviewCard } from "@/components/evidence/evidence-review-card";
import { CONFIDENCE_LABEL } from "@/lib/analysis/labels";
import { formatNumber } from "@/lib/utils/format";
import type { EvidenceReview, ReviewTheme } from "@/lib/analysis/types";

interface EvidenceDrawerProps {
  theme: ReviewTheme | null;
  evidence: readonly EvidenceReview[];
  onClose: () => void;
}

/**
 * The single evidence drawer instance for the report — content swaps
 * based on which theme was last opened rather than mounting a new
 * drawer per trigger, so only one can ever be visible at a time.
 */
export function EvidenceDrawer({ theme, evidence, onClose }: EvidenceDrawerProps) {
  return (
    <Sheet
      open={theme !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Evidence</SheetTitle>
          {theme && <SheetDescription>{theme.label}</SheetDescription>}
        </SheetHeader>

        {theme && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {evidence.length} of {formatNumber(theme.reviewCount)} mentions
              shown
            </span>
            <span className="tabular-nums">
              {theme.gamesFoundIn} / {theme.gamesTotal} games
            </span>
            <span>{CONFIDENCE_LABEL[theme.confidence]}</span>
          </div>
        )}

        <div className="-mx-6 flex flex-1 flex-col gap-3 overflow-y-auto px-6">
          {evidence.map((review) => (
            <EvidenceReviewCard key={review.id} review={review} />
          ))}
          {theme && evidence.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sample reviews captured for this theme yet.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
