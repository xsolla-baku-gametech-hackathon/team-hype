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
    placement: "Landing hero visual stage",
    crop: "Centered subject, 8-12% padding",
    animation: "Subtle float + pointer parallax",
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
  supportHexShard: {
    id: "support-hex-shard",
    purpose: "Floating hexagonal metallic shard around the hero.",
    prompt: "Isolated hexagonal brushed metal shard, blue-violet rim glow, transparent PNG",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Hero orbit upper-right",
    crop: "Subject centered",
    animation: "Independent float offset",
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
    placement: "Hero orbit lower-left",
    crop: "Subject centered",
    animation: "Slow tilt + float",
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
    placement: "Hero orbit mid-right",
    crop: "Subject centered",
    animation: "Parallax opposite to pointer",
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
    placement: "Hero orbit upper-left",
    crop: "Subject centered",
    animation: "Gentle bob",
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
    placement: "Hero orbit lower-right",
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

export const HERO_SUPPORT_FRAGMENTS = [
  {
    asset: VISUAL_ASSETS.supportEnergyModule,
    className: "left-[-4%] top-[8%] w-[28%] opacity-80",
    floatDuration: 6.2,
    parallax: 0.55,
  },
  {
    asset: VISUAL_ASSETS.supportHexShard,
    className: "right-[-2%] top-[12%] w-[26%] opacity-75",
    floatDuration: 7.1,
    parallax: -0.45,
  },
  {
    asset: VISUAL_ASSETS.supportHoloPanel,
    className: "bottom-[6%] left-[-6%] w-[32%] opacity-70",
    floatDuration: 8.0,
    parallax: 0.7,
  },
  {
    asset: VISUAL_ASSETS.supportTechPlate,
    className: "right-[-8%] bottom-[18%] w-[30%] opacity-65",
    floatDuration: 6.8,
    parallax: -0.6,
  },
  {
    asset: VISUAL_ASSETS.supportInterfaceFrame,
    className: "top-[42%] right-[4%] hidden w-[22%] opacity-55 lg:block",
    floatDuration: 9.2,
    parallax: 0.35,
  },
] as const;
