"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DEMO_ANALYSIS_PATH } from "@/lib/site-config";

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-start justify-center gap-4 px-6 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Analysis unavailable
      </h1>
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t load this report. Check the link or try again.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={DEMO_ANALYSIS_PATH}>View demo</Link>
        </Button>
      </div>
    </div>
  );
}
