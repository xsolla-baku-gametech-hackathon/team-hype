import dynamic from "next/dynamic";

import { HeroSection } from "@/components/landing/hero-section";
import { TrustBar } from "@/components/landing/trust-bar";

const InteractiveShowcase = dynamic(() =>
  import("@/components/landing/interactive-showcase").then((mod) => ({
    default: mod.InteractiveShowcase,
  })),
);

const PipelineStrip = dynamic(() =>
  import("@/components/landing/pipeline-strip").then((mod) => ({
    default: mod.PipelineStrip,
  })),
);

const ConceptForm = dynamic(() =>
  import("@/components/landing/concept-form").then((mod) => ({
    default: mod.ConceptForm,
  })),
);

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
