import { ThumbsDown, ThumbsUp } from "lucide-react";

import { ThemeCard } from "@/components/insights/theme-card";
import { cn } from "@/lib/utils/cn";
import type { ReviewSentiment, ReviewTheme } from "@/lib/analysis/types";

interface ThemeColumnProps {
  title: string;
  sentiment: ReviewSentiment;
  themes: readonly ReviewTheme[];
}

export function ThemeColumn({ title, sentiment, themes }: ThemeColumnProps) {
  const Icon = sentiment === "positive" ? ThumbsUp : ThumbsDown;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon
          className={cn(
            "size-4",
            sentiment === "positive" ? "text-positive" : "text-negative",
          )}
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="flex flex-col gap-3">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}
