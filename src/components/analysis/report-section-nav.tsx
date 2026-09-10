import Link from "next/link";

import { ExportReportButton } from "@/components/analysis/export-report-button";

interface ReportSectionLink {
  readonly id: string;
  readonly label: string;
}

const SECTION_LINKS: readonly ReportSectionLink[] = [
  { id: "overview", label: "Overview" },
  { id: "competitors", label: "Competitors" },
  { id: "player-voice", label: "Player Voice" },
  { id: "opportunities", label: "Opportunities" },
  { id: "evidence", label: "Evidence" },
];

/**
 * Plain in-page anchor links rather than a scroll-spy tab bar — every
 * section this points to is added incrementally across stages, and a
 * simple anchor list degrades gracefully (a no-op scroll) for sections
 * that don't exist yet instead of erroring.
 */
export function ReportSectionNav() {
  return (
    <nav
      aria-label="Report sections"
      className="sticky top-16 z-30 -mx-6 flex items-center justify-between gap-4 overflow-x-auto border-b border-border bg-background/80 px-6 py-3 text-sm text-muted-foreground backdrop-blur-md print:hidden sm:-mx-8 sm:px-8"
    >
      <div className="flex gap-5">
        {SECTION_LINKS.map((link) => (
          <Link
            key={link.id}
            href={`#${link.id}`}
            className="shrink-0 transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ExportReportButton />
    </nav>
  );
}
