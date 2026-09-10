import { Sparkles } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: string;
}

/** The single-paragraph takeaway a busy reader should walk away with. */
export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-accent/25 bg-accent/5 p-5">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
    </div>
  );
}
