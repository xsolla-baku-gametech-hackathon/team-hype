import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { AnalysisStage } from "@/lib/analysis/constants";

export type StageStatus = "done" | "active" | "pending";

interface AnalysisProgressProps {
  stages: readonly AnalysisStage[];
  activeIndex: number;
}

function statusOf(index: number, activeIndex: number): StageStatus {
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

/**
 * Purely presentational checklist — all timing/state lives in
 * `AnalysisExperience` so this component stays trivially testable and
 * reusable if the real pipeline ever reports live stage progress.
 */
export function AnalysisProgress({ stages, activeIndex }: AnalysisProgressProps) {
  const activeLabel = stages[activeIndex]?.label;

  return (
    <div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {activeLabel ? `Current stage: ${activeLabel}` : null}
      </p>
      <ol className="flex flex-col gap-3">
        {stages.map((stage, index) => {
          const status = statusOf(index, activeIndex);

          return (
            <li
              key={stage.id}
              aria-current={status === "active" ? "step" : undefined}
              className="flex items-center gap-3"
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]",
                  status === "done" &&
                    "border-positive/40 bg-positive/10 text-positive",
                  status === "active" &&
                    "border-accent/40 bg-accent/10 text-accent",
                  status === "pending" &&
                    "border-border-strong text-muted-foreground",
                )}
              >
                {status === "done" && <Check className="size-3" aria-hidden="true" />}
                {status === "active" && (
                  <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "text-sm transition-colors",
                  status === "pending" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
