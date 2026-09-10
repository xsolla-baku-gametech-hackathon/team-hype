import Link from "next/link";
import { SearchX } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { DEMO_ANALYSIS_PATH } from "@/lib/site-config";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
      <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        That route does not exist. Head back to the homepage to analyze a concept
        or open the demo report.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={DEMO_ANALYSIS_PATH}>View demo</Link>
        </Button>
      </div>
    </Container>
  );
}
