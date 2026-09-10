import { ConceptForm } from "@/components/landing/concept-form";
import { WorkflowSteps } from "@/components/landing/workflow-steps";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { APP_DESCRIPTION, APP_TAGLINE } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section id="product" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,var(--border-strong)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      <Container className="flex flex-col items-center gap-8 py-20 text-center sm:py-28">
        <Badge variant="accent">Market intelligence for game developers</Badge>

        <div className="flex max-w-3xl flex-col gap-5">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {APP_TAGLINE}
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
            {APP_DESCRIPTION}
          </p>
        </div>

        <ConceptForm />

        <div id="how-it-works" className="pt-6">
          <WorkflowSteps />
        </div>
      </Container>
    </section>
  );
}
