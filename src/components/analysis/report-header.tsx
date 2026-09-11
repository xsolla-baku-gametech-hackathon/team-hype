"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { GENRE_OPTIONS, PLATFORM_OPTIONS } from "@/lib/analysis/constants";
import { PENDING_CONCEPT_STORAGE_KEY } from "@/lib/analysis/pending-concept";
import type { AnalysisReport } from "@/lib/analysis/types";

interface ReportHeaderProps {
  report: AnalysisReport;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const [concept, setConcept] = useState(report.concept);
  const platformLabel = PLATFORM_OPTIONS.find(
    (option) => option.value === report.platform,
  )?.label;
  const genreLabel = GENRE_OPTIONS.find(
    (option) => option.value === report.genre,
  )?.label;

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem(PENDING_CONCEPT_STORAGE_KEY);
      if (pending) {
        setConcept(pending);
        sessionStorage.removeItem(PENDING_CONCEPT_STORAGE_KEY);
        return;
      }
    } catch {
      // Ignore storage access failures.
    }
    setConcept(report.concept);
  }, [report.concept, report.id]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">Market Analysis</Badge>
        {platformLabel && <Badge variant="neutral">{platformLabel}</Badge>}
        {genreLabel && <Badge variant="neutral">{genreLabel}</Badge>}
      </div>
      <h1 className="font-display max-w-3xl text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
        {concept}
      </h1>
      <p className="text-xs text-muted-foreground">
        Generated{" "}
        <time dateTime={report.createdAt}>
          {new Date(report.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </p>
    </div>
  );
}
