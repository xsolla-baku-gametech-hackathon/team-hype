import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { DEMO_ANALYSIS_PATH } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Analysis not found",
};

export default function AnalysisNotFound() {
  return (
      <Container className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-foreground">
        We couldn&apos;t find that analysis
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This report may have expired or the link is incorrect. Start a new
        analysis from the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/#analyze">Analyze a new concept</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={DEMO_ANALYSIS_PATH}>View demo</Link>
        </Button>
      </div>
    </Container>
  );
}
