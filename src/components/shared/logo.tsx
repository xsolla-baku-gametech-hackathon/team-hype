import { ScanSearch } from "lucide-react";

import { APP_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
}

/**
 * Product mark used in the header and footer. A single lucide icon keeps
 * the mark crisp at any size instead of shipping a raster/SVG asset.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-accent/15 text-accent">
        <ScanSearch className="size-4" aria-hidden="true" />
      </span>
      {APP_NAME}
    </span>
  );
}
