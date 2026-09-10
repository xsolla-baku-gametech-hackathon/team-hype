import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-3.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus-visible:border-accent/60 focus-visible:ring-3 focus-visible:ring-accent/15",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
