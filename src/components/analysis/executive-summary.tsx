import { Sparkles } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: string;
}

/** The single-paragraph takeaway a busy reader should walk away with. */
export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <section aria-labelledby="executive-summary-heading" className="flex gap-3 rounded-lg border border-accent/25 bg-accent/5 p-5">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <div>
        <h3 id="executive-summary-heading" className="text-sm font-semibold text-foreground">
          Executive summary
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground">{summary}</p>
      </div>
    </section>
  );
}
