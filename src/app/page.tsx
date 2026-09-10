import { ConceptForm } from "@/components/landing/concept-form";
import { HeroSection } from "@/components/landing/hero-section";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";
import { PipelineStrip } from "@/components/landing/pipeline-strip";
import { TrustBar } from "@/components/landing/trust-bar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <InteractiveShowcase />
      <PipelineStrip />
      <ConceptForm />
    </>
  );
}
