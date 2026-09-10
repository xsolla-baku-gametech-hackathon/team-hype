import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV } from "@/lib/site-config";

/**
 * Persistent top navigation. Server-rendered — it has no client
 * interactivity of its own, so it stays out of the client JS bundle.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="GameLens home">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm">
          <Link href="/#analyze">Analyze Market</Link>
        </Button>
      </Container>
    </header>
  );
}
