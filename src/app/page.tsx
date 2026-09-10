import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

/**
 * Temporary placeholder for the landing experience.
 *
 * This page currently only proves out the app shell (header, footer,
 * container, and design tokens). The full hero, concept input, and
 * workflow visualization are built in the next stage.
 */
export default function Home() {
  return (
    <Container className="flex flex-col items-center gap-4 py-32 text-center">
      <Badge variant="accent">Foundation ready</Badge>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        GameLens landing experience arrives in the next stage.
      </h1>
      <p className="max-w-md text-muted-foreground">
        Header, footer, container, and the dark design system are wired up
        and ready to build on.
      </p>
    </Container>
  );
}
