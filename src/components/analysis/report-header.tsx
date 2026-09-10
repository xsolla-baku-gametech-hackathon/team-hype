import { Badge } from "@/components/ui/badge";
import { GENRE_OPTIONS, PLATFORM_OPTIONS } from "@/lib/analysis/constants";
import type { AnalysisReport } from "@/lib/analysis/types";

interface ReportHeaderProps {
  report: AnalysisReport;
}

/** Renders the developer's original concept plus their optional filters as badges. */
export function ReportHeader({ report }: ReportHeaderProps) {
  const platformLabel = PLATFORM_OPTIONS.find(
    (option) => option.value === report.platform,
  )?.label;
  const genreLabel = GENRE_OPTIONS.find(
    (option) => option.value === report.genre,
  )?.label;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">Market Analysis</Badge>
        {platformLabel && <Badge variant="neutral">{platformLabel}</Badge>}
        {genreLabel && <Badge variant="neutral">{genreLabel}</Badge>}
      </div>
      {/* The report's only h1 — every section below uses h2, so the page
       * has exactly one top-level heading regardless of which analysis
       * id is being viewed. */}
      <h1 className="max-w-3xl text-lg leading-relaxed text-foreground">
        {report.concept}
      </h1>
    </div>
  );
}
