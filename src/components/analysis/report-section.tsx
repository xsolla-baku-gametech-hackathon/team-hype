import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ReportSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ReportSection({
  id,
  title,
  description,
  children,
  className,
}: ReportSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-28", className)}>
      <div className="mb-6 max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
