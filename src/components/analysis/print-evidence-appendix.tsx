import { ReportSection } from "@/components/analysis/report-section";
import { EvidenceReviewCard } from "@/components/evidence/evidence-review-card";
import { getEvidenceForTheme } from "@/lib/analysis/scoring";
import type { EvidenceReview, ReviewTheme } from "@/lib/analysis/types";

interface PrintEvidenceAppendixProps {
  themes: readonly ReviewTheme[];
  evidence: readonly EvidenceReview[];
}

/**
 * On screen, evidence only surfaces inside the "View Evidence" drawer
 * (rendered in a portal, closed by default) — printing can't follow that
 * interaction, so the PDF gets its own always-rendered appendix, grouped
 * by theme to match how evidence is browsed on screen.
 */
export function PrintEvidenceAppendix({
  themes,
  evidence,
}: PrintEvidenceAppendixProps) {
  return (
    <div className="hidden print:block">
      <ReportSection
        id="print-evidence"
        title="Evidence"
        description="Player reviews supporting the themes and opportunities above."
      >
        <div className="flex flex-col gap-6">
          {themes.map((theme) => {
            const themeEvidence = getEvidenceForTheme(evidence, theme.id);
            if (themeEvidence.length === 0) {
              return null;
            }

            return (
              <div key={theme.id} className="flex flex-col gap-3 print:break-inside-avoid">
                <h3 className="text-sm font-semibold text-foreground">
                  {theme.label}
                </h3>
                <div className="flex flex-col gap-3">
                  {themeEvidence.map((review) => (
                    <EvidenceReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ReportSection>
    </div>
  );
}
