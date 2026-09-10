import { ChevronRight, Compass, PenLine, ScanSearch, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WorkflowStep {
  readonly label: string;
  readonly icon: LucideIcon;
}

const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  { label: "Describe", icon: PenLine },
  { label: "Compare", icon: ScanSearch },
  { label: "Understand Players", icon: Users },
  { label: "Discover Opportunities", icon: Compass },
];

/**
 * A compact, glanceable summary of the product flow — deliberately not a
 * full explainer section, since the landing page must stay short.
 */
export function WorkflowSteps() {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 text-sm text-muted-foreground">
      {WORKFLOW_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === WORKFLOW_STEPS.length - 1;

        return (
          <li key={step.label} className="flex items-center gap-2">
            <span className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5">
              <Icon className="size-3.5 text-accent" aria-hidden="true" />
              {step.label}
            </span>
            {!isLast && (
              <ChevronRight
                className="size-4 text-muted-foreground/50"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
