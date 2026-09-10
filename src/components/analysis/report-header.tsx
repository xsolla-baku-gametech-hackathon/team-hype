import { Badge } from "@/components/ui/badge";
import { GENRE_OPTIONS, PLATFORM_OPTIONS } from "@/lib/analysis/constants";
import type { AnalysisReport } from "@/lib/analysis/types";

interface ReportHeaderProps {
  report: AnalysisReport;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const platformLabel = PLATFORM_OPTIONS.find(
    (option) => option.value === report.platform,
  )?.label;
  const genreLabel = GENRE_OPTIONS.find(
    (option) => option.value === report.genre,
  )?.label;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">Market Analysis</Badge>
        {platformLabel && <Badge variant="neutral">{platformLabel}</Badge>}
        {genreLabel && <Badge variant="neutral">{genreLabel}</Badge>}
      </div>
      <h1 className="font-display max-w-3xl text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
        {report.concept}
      </h1>
    </div>
  );
}
