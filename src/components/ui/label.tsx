import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "mb-1.5 block text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
