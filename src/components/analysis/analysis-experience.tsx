"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { AnalysisProgress } from "@/components/analysis/analysis-progress";
import { CompetitorRevealList } from "@/components/analysis/competitor-reveal-list";
import { ExecutiveSummary } from "@/components/analysis/executive-summary";
import { MarketLandscapePanel } from "@/components/analysis/market-landscape-panel";
import { MetricsRow } from "@/components/analysis/metrics-row";
import { PrintEvidenceAppendix } from "@/components/analysis/print-evidence-appendix";
import { PrintRecommendations } from "@/components/analysis/print-recommendations";
import { ReportHeader } from "@/components/analysis/report-header";
import { ReportSection } from "@/components/analysis/report-section";
import { ReportSectionNav } from "@/components/analysis/report-section-nav";
import { Badge } from "@/components/ui/badge";
import { EvidenceProvider } from "@/components/evidence/evidence-context";
import { CompetitorGrid } from "@/components/games/competitor-grid";
import { ThemeColumn } from "@/components/insights/theme-column";
import { OpportunityList } from "@/components/opportunities/opportunity-list";
import { ANALYSIS_STAGES } from "@/lib/analysis/constants";
import { groupThemesBySentiment } from "@/lib/analysis/scoring";
import type { AnalysisReport } from "@/lib/analysis/types";

interface AnalysisExperienceProps {
  report: AnalysisReport;
}

/**
 * Plain concentric ring loader — no icon in the center. Outer ring
 * rotates one way, inner ring the other, with a soft accent pulse.
 * Purely decorative; sits above the headline, not overlapping it.
 */
function ScanRing() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative mb-2 flex size-24 items-center justify-center sm:size-28"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.12_185_/_0.28),transparent_72%)] blur-xl" />

      <motion.div
        className="absolute inset-0 rounded-full border-2 border-accent/25"
        style={{ borderTopColor: "var(--accent)" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full border border-dashed border-white/20"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[38%] rounded-full bg-accent/70"
        animate={
          reduce
            ? undefined
            : { opacity: [0.5, 1, 0.5], scale: [0.9, 1.08, 0.9] }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function AnalysisExperience({ report }: AnalysisExperienceProps) {
  const reduce = useReducedMotion();
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
    const { positive, complaint } = groupThemesBySentiment(report.themes);

    return (
      <EvidenceProvider themes={report.themes} evidence={report.evidence}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-14 pb-24"
        >
          <ReportSectionNav />

          <ReportSection id="overview" title="Overview">
            <div className="flex flex-col gap-10 pt-4">
              <ReportHeader report={report} />
              <MetricsRow summary={report.summary} />
              <ExecutiveSummary summary={report.executiveSummary} />
              <MarketLandscapePanel landscape={report.marketLandscape} />
            </div>
          </ReportSection>

          <ReportSection
            id="competitors"
            title="Comparable Games"
            description="Steam titles closest to your concept, ranked by semantic similarity."
          >
            <CompetitorGrid games={report.comparableGames} />
          </ReportSection>

          <ReportSection
            id="player-voice"
            title="Player Voice"
            description="Recurring patterns mined from player reviews across every comparable game."
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ThemeColumn
                title="Players Love"
                sentiment="positive"
                themes={positive}
              />
              <ThemeColumn
                title="Players Complain About"
                sentiment="complaint"
                themes={complaint}
              />
            </div>
          </ReportSection>

          <ReportSection
            id="opportunities"
            title="Market Opportunities"
            description="Ranked, evidence-backed recommendations synthesized from the patterns above."
          >
            <OpportunityList opportunities={report.opportunities} />
          </ReportSection>

          <section
            id="evidence"
            className="scroll-mt-28 rounded-xl border border-dashed border-accent/25 bg-accent/[0.04] px-5 py-6 sm:px-7"
          >
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              Evidence drawer
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Open any theme or opportunity with View Evidence to inspect the
              source Steam reviews that back the claim. Print export includes the
              full evidence appendix.
            </p>
          </section>

          <PrintRecommendations opportunities={report.opportunities} />
          <PrintEvidenceAppendix themes={report.themes} evidence={report.evidence} />
        </motion.div>
      </EvidenceProvider>
    );
  }

  return (
    <div className="relative flex min-h-[70dvh] flex-col items-center justify-center gap-10 py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,oklch(0.55_0.1_185_/_0.14),transparent_65%)]"
      />

      <ScanRing />

      <div className="flex flex-col items-center gap-3">
        <Badge variant="accent">Analyzing your concept</Badge>
        <h1 className="font-display max-w-lg text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Finding what players already think
        </h1>
      </div>

      <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface/80 p-6 text-left panel-bevel">
        <AnalysisProgress stages={ANALYSIS_STAGES} activeIndex={activeStageIndex} />
      </div>

      <div className="flex flex-col items-center gap-3">
        {revealedGameCount > 0 && (
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
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
