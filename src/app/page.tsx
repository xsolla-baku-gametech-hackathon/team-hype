import dynamic from "next/dynamic";
import { preload } from "react-dom";

import { HeroSection } from "@/components/landing/hero-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { VISUAL_ASSETS } from "@/lib/visual-assets";

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

preload(VISUAL_ASSETS.heroOrbit.path, { as: "image" });

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
