import { APP_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** Keep prop for call sites; wordmark-only — no icon mark. */
  markOnly?: boolean;
}

/**
 * GameTech wordmark — display type only, no icon glyph.
 */
export function Logo({ className, markOnly = false }: LogoProps) {
  if (markOnly) {
    return <span className="sr-only">{APP_NAME}</span>;
  }

  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline gap-[0.2em] text-[1.05rem] leading-none font-bold tracking-[-0.04em] text-white sm:text-[1.15rem]",
        className,
      )}
    >
      <span className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
        {APP_NAME}
      </span>
      <span
        aria-hidden="true"
        className="mb-[0.12em] size-[0.28em] shrink-0 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]"
      />
    </span>
  );
}
