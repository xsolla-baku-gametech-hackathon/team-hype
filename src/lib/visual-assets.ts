/**
 * Generated GameTech visual assets (transparent PNG, 2048²).
 * Drop Nano Banana / external exports into the same paths to swap.
 */

export interface VisualAssetSpec {
  readonly id: string;
  readonly purpose: string;
  readonly prompt: string;
  readonly aspectRatio: string;
  readonly resolution: string;
  readonly transparent: boolean;
  readonly placement: string;
  readonly crop: string;
  readonly animation: string;
  readonly mobileFallback: string;
  readonly path: string;
}

export const VISUAL_ASSETS = {
  heroOrbit: {
    id: "hero-core",
    purpose:
      "Primary hero centerpiece: hexagonal / layered energy processor core.",
    prompt:
      "Floating high-tech hexagonal energy processor / digital arena core, layered metallic panels, translucent glass, luminous circuitry, blue-violet glow, transparent background, AAA 3D render",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Landing hero visual stage - central focal core",
    crop: "Centered subject, slight scale-up to fill stage",
    animation: "Subtle float + pointer parallax + glow pulse",
    mobileFallback: "Static float only, reduced scale",
    path: "/images/main_hero_object_transparent.png",
  },
  heroCoreAlt: {
    id: "hero-core-alt",
    purpose: "Alternate generated hero core (cylindrical / layered processor).",
    prompt:
      "AAA 3D floating energy core, dark brushed metal, glass layers, blue violet glow, transparent background",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Optional swap for heroOrbit",
    crop: "Centered",
    animation: "Same as heroOrbit",
    mobileFallback: "Static",
    path: "/images/hero-core-transparent.png",
  },
  heroAtmosphere: {
    id: "hero-atmosphere",
    purpose:
      "Wide cinematic depth plate behind the hero - extends the scene horizontally.",
    prompt:
      "Cinematic GameTech energy core environment with volumetric rays, dark industrial depth",
    aspectRatio: "1:1",
    resolution: "native",
    transparent: false,
    placement: "Full-bleed hero backdrop, blurred and masked wide",
    crop: "Center crop stretched wide with soft edge falloff",
    animation: "Slow ken-burns + horizontal drift",
    mobileFallback: "Static crop, lower opacity",
    path: "/images/secondary_section_visual.jpeg",
  },
  supportHexShard: {
    id: "support-hex-shard",
    purpose: "Floating hexagonal metallic shard around the hero.",
    prompt: "Isolated hexagonal brushed metal shard, blue-violet rim glow, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero orbit path - right arc",
    crop: "Subject centered",
    animation: "Orbital path + float",
    mobileFallback: "Hide or opacity 40%",
    path: "/images/support-hex-shard-transparent.png",
  },
  supportHoloPanel: {
    id: "support-holo-panel",
    purpose: "Glass holographic panel fragment.",
    prompt: "Floating glass holographic panel, luminous edges, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero orbit path - left arc",
    crop: "Subject centered",
    animation: "Slow tilt + orbital drift",
    mobileFallback: "Hide",
    path: "/images/support-holo-panel-transparent.png",
  },
  supportTechPlate: {
    id: "support-tech-plate",
    purpose: "Illuminated tech plate / circuit slab.",
    prompt: "Illuminated dark metal tech plate with circuit glow, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero orbit path - far right",
    crop: "Subject centered",
    animation: "Horizontal flow counter-parallax",
    mobileFallback: "Hide",
    path: "/images/support-tech-plate-transparent.png",
  },
  supportEnergyModule: {
    id: "support-energy-module",
    purpose: "Small floating energy module / capsule.",
    prompt: "Small hexagonal energy module with glass core glow, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero orbit path - far left / process node",
    crop: "Subject centered",
    animation: "Gentle bob on ring path",
    mobileFallback: "Keep tiny",
    path: "/images/support-energy-module-transparent.png",
  },
  supportInterfaceFrame: {
    id: "support-interface-frame",
    purpose: "Thin futuristic interface frame.",
    prompt: "Thin HUD interface frame, dark metal, luminous edges, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero mid-ring overlay",
    crop: "Subject centered",
    animation: "Slow counter-rotate",
    mobileFallback: "Hide",
    path: "/images/support-interface-frame-transparent.png",
  },
  analyzeGlow: {
    id: "analyze-glow",
    purpose: "Analyze section decorative support (reuses holo panel).",
    prompt: "Same family as supportHoloPanel",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Analyze section right column",
    crop: "Subject mid-frame",
    animation: "Idle float",
    mobileFallback: "Omit",
    path: "/images/support-holo-panel-transparent.png",
  },
  reportCommand: {
    id: "report-command",
    purpose: "Analysis progress centerpiece (reuses energy module).",
    prompt: "Same family as supportEnergyModule",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Analysis progress state",
    crop: "Centered",
    animation: "Slow rotation",
    mobileFallback: "Static reduced size",
    path: "/images/support-energy-module-transparent.png",
  },
} as const satisfies Record<string, VisualAssetSpec>;

/** Wide-stage orbital fragment placement (percentages of the stage). */
export const HERO_ORBIT_NODES = [
  {
    asset: VISUAL_ASSETS.supportEnergyModule,
    className: "left-[1%] top-[18%] w-[16%] sm:w-[13%] lg:w-[11%]",
    floatDuration: 6.2,
    parallax: 0.55,
    showOnMobile: true,
  },
  {
    asset: VISUAL_ASSETS.supportHoloPanel,
    className: "left-[6%] bottom-[14%] w-[20%] sm:w-[16%] lg:w-[13%] opacity-80",
    floatDuration: 7.4,
    parallax: 0.7,
    showOnMobile: false,
  },
  {
    asset: VISUAL_ASSETS.supportHexShard,
    className: "right-[4%] top-[12%] w-[17%] sm:w-[14%] lg:w-[11%] opacity-85",
    floatDuration: 7.1,
    parallax: -0.45,
    showOnMobile: true,
  },
  {
    asset: VISUAL_ASSETS.supportTechPlate,
    className: "right-0 bottom-[14%] w-[19%] sm:w-[15%] lg:w-[12%] opacity-75",
    floatDuration: 6.8,
    parallax: -0.6,
    showOnMobile: false,
  },
  {
    asset: VISUAL_ASSETS.supportInterfaceFrame,
    className: "left-[16%] top-[8%] hidden w-[11%] opacity-50 lg:block",
    floatDuration: 9.2,
    parallax: 0.35,
    showOnMobile: false,
  },
] as const;
