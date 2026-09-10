import { APP_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** Hide wordmark when only the mark is needed. */
  markOnly?: boolean;
}

/**
 * Custom aperture-lens mark — geometric SVG, no Lucide default icon.
 */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent shadow-[0_0_24px_-8px_var(--accent-glow)]"
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none">
          <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
          <circle cx="12" cy="12" r="4.75" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 7.4 14.6 12 12 16.6 9.4 12 12 7.4Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.35" fill="currentColor" />
        </svg>
      </span>
      {markOnly ? <span className="sr-only">{APP_NAME}</span> : APP_NAME}
    </span>
  );
}
