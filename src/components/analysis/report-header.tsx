"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { GENRE_OPTIONS, PLATFORM_OPTIONS } from "@/lib/analysis/constants";
import { PENDING_CONCEPT_STORAGE_KEY } from "@/lib/analysis/pending-concept";
import type { AnalysisReport } from "@/lib/analysis/types";

interface ReportHeaderProps {
  report: AnalysisReport;
}

function readAndClearPendingConcept(): string | null {
  try {
    const pending = sessionStorage.getItem(PENDING_CONCEPT_STORAGE_KEY);
    if (!pending) return null;
    sessionStorage.removeItem(PENDING_CONCEPT_STORAGE_KEY);
    return pending;
  } catch {
    return null;
  }
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const [concept, setConcept] = useState(report.concept);
  const [conceptSourceId, setConceptSourceId] = useState(report.id);
  const platformLabel = PLATFORM_OPTIONS.find(
    (option) => option.value === report.platform,
  )?.label;
  const genreLabel = GENRE_OPTIONS.find(
    (option) => option.value === report.genre,
  )?.label;

  // Keep headline in sync when navigating between report ids (render-time
  // sync avoids setState-in-effect cascading renders).
  if (conceptSourceId !== report.id) {
    setConceptSourceId(report.id);
    setConcept(report.concept);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const pending = readAndClearPendingConcept();
      if (pending) setConcept(pending);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [report.id]);

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
