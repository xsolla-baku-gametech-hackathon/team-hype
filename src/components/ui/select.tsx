import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * A styled native `<select>` rather than a Radix combobox. Platform and
 * genre are simple, short option lists, so the native element keeps
 * keyboard/screen-reader behavior free and avoids extra client JS.
 */
function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "w-full appearance-none rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:border-accent/60 focus-visible:ring-3 focus-visible:ring-accent/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export { Select };
