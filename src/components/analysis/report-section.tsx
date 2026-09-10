import type { ReactNode } from "react";

interface ReportSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Consistent heading + anchor treatment shared by every report section. */
export function ReportSection({
  id,
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-5 scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
