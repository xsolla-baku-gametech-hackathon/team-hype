"use client";

import { useEffect, useState } from "react";

import { AnalysisProgress } from "@/components/analysis/analysis-progress";
import { CompetitorRevealList } from "@/components/analysis/competitor-reveal-list";
import { MetricsRow } from "@/components/analysis/metrics-row";
import { ReportHeader } from "@/components/analysis/report-header";
import { ReportSection } from "@/components/analysis/report-section";
import { ReportSectionNav } from "@/components/analysis/report-section-nav";
import { Badge } from "@/components/ui/badge";
import { CompetitorGrid } from "@/components/games/competitor-grid";
import { ANALYSIS_STAGES } from "@/lib/analysis/constants";
import type { AnalysisReport } from "@/lib/analysis/types";

interface AnalysisExperienceProps {
  report: AnalysisReport;
}

/**
 * Owns the transition from the simulated progress screen to the report
 * shell. Timing is entirely local/mocked for this stage — once a real
 * analysis pipeline exists, this is the component that would swap the
 * fixed timers for actual stage/status events from the server.
 */
export function AnalysisExperience({ report }: AnalysisExperienceProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [revealedGameCount, setRevealedGameCount] = useState(0);
  const [isReportReady, setIsReportReady] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const totalDurationMs = ANALYSIS_STAGES.reduce(
      (sum, stage) => sum + stage.durationMs,
      0,
    );

    let elapsed = 0;
    for (const [index, stage] of ANALYSIS_STAGES.entries()) {
      timeouts.push(setTimeout(() => setActiveStageIndex(index), elapsed));
      elapsed += stage.durationMs;
    }

    // Reveal comparable games gradually across the middle of the
    // timeline so the "finding comparable games" stage feels alive
    // instead of a static checklist.
    const revealStartMs = ANALYSIS_STAGES[0]?.durationMs ?? 0;
    const revealEndMs = totalDurationMs - (ANALYSIS_STAGES.at(-1)?.durationMs ?? 0);
    const gameCount = report.comparableGames.length;
    const revealStepMs = gameCount > 0 ? (revealEndMs - revealStartMs) / gameCount : 0;

    for (let index = 0; index < gameCount; index += 1) {
      timeouts.push(
        setTimeout(
          () => setRevealedGameCount(index + 1),
          revealStartMs + revealStepMs * (index + 1),
        ),
      );
    }

    timeouts.push(setTimeout(() => setIsReportReady(true), totalDurationMs));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [report.comparableGames.length]);

  if (isReportReady) {
    return (
      <div className="flex flex-col gap-12 pb-20">
        <ReportSectionNav />

        <ReportSection id="overview" title="Overview">
          <div className="flex flex-col gap-8 pt-4">
            <ReportHeader report={report} />
            <MetricsRow summary={report.summary} />
          </div>
        </ReportSection>

        <ReportSection
          id="competitors"
          title="Comparable Games"
          description="Steam titles closest to your concept, ranked by semantic similarity."
        >
          <CompetitorGrid games={report.comparableGames} />
        </ReportSection>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <Badge variant="accent">Analyzing your concept</Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Finding what players already think
        </h1>
      </div>

      <AnalysisProgress stages={ANALYSIS_STAGES} activeIndex={activeStageIndex} />

      <div className="flex flex-col items-center gap-3">
        {revealedGameCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {revealedGameCount} of {report.comparableGames.length} comparable
            games found
          </p>
        )}
        <CompetitorRevealList
          games={report.comparableGames.slice(0, revealedGameCount)}
        />
      </div>
    </div>
  );
}
