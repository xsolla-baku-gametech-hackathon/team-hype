import { DEMO_ANALYSIS_REPORT } from "@/lib/analysis/mock-data";
import type { AnalysisReport } from "@/lib/analysis/types";

/**
 * Single lookup seam between the report page and its data source. Only
 * the hackathon demo id resolves today; once `/api/analysis` exists,
 * this becomes the one place that needs to start calling it instead of
 * reading the fixture.
 */
export function getAnalysisReport(id: string): AnalysisReport | null {
  if (id === DEMO_ANALYSIS_REPORT.id) {
    return DEMO_ANALYSIS_REPORT;
  }

  return null;
}
