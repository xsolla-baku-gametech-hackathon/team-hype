"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Reuses the on-screen report markup for the PDF instead of a separate
 * renderer — `globals.css` swaps every design token to a print-safe
 * light theme and hides interactive chrome under `@media print`, so the
 * browser's native "Save as PDF" produces a clean, fixed-layout report
 * with zero extra dependencies.
 */
export function ExportReportButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Download aria-hidden="true" />
      Export Report
    </Button>
  );
}
