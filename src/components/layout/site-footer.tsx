import { Container } from "@/components/layout/container";
import { Logo } from "@/components/shared/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border print:hidden">
      <Container className="flex flex-col items-start justify-between gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <Logo className="text-muted-foreground" />
        <p>
          Built for the Xsolla Baku GameTech Hackathon &mdash; market
          intelligence sourced from real Steam player reviews.
        </p>
      </Container>
    </footer>
  );
}
