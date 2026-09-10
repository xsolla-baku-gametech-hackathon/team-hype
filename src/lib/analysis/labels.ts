import type { ConfidenceLevel } from "@/lib/analysis/types";

/** Shared between theme cards, opportunity cards, and the evidence drawer. */
export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};
