import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Constrains and horizontally centers page content at a width that reads
 * well on wide desktop displays (the primary demo context) while staying
 * flush on mobile.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}
