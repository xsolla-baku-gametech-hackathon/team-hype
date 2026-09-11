import { z } from "zod";

import { DEMO_ANALYSIS_REPORT } from "@/lib/analysis/mock-data";
import {
  GENRES,
  PLATFORMS,
  type AnalysisReport,
} from "@/lib/analysis/types";

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

const reportQueryOverridesSchema = z.object({
  platform: z.enum(PLATFORMS).optional(),
  genre: z.enum(GENRES).optional(),
});

/**
 * Applies optional platform/genre query params from the concept form onto
 * a loaded report. Invalid values are ignored so deep links stay safe.
 */
export function applyReportQueryOverrides(
  report: AnalysisReport,
  query: { readonly platform?: string; readonly genre?: string },
): AnalysisReport {
  const parsed = reportQueryOverridesSchema.safeParse({
    platform: query.platform || undefined,
    genre: query.genre || undefined,
  });

  if (!parsed.success) return report;

  return {
    ...report,
    ...(parsed.data.platform !== undefined
      ? { platform: parsed.data.platform }
      : {}),
    ...(parsed.data.genre !== undefined ? { genre: parsed.data.genre } : {}),
  };
}
