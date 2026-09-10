import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/shared/logo";
import { PRIMARY_NAV } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] print:hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_120%,oklch(0.55_0.1_185_/_0.12),transparent_60%)]"
      />
      <Container className="relative flex flex-col gap-10 py-14 sm:py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Market intelligence for game developers — grounded in what Steam
              players already say.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/45">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/#analyze" className="transition-colors hover:text-white">
              Analyze
            </Link>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>Built for the Xsolla Baku GameTech Hackathon.</p>
          <p>Steam player reviews power the evidence layer.</p>
        </div>
      </Container>
    </footer>
  );
}
