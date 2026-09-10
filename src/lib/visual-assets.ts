/**
 * Specs for Nano Banana Pro (or similar) assets.
 * Drop finished files into /public/visuals/ using the `path` field.
 * The UI already references these paths with graceful CSS fallbacks.
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
    id: "hero-orbit",
    purpose:
      "Hero visual centerpiece: floating orbital lens / holographic GameTech structure that sells the product in the first 3 seconds.",
    prompt:
      "Cinematic floating GameTech holographic lens apparatus, circular orbital rings and aperture iris, translucent cyan-teal energy, soft volumetric light, brushed dark metal and glass materials, subtle HUD fragments orbiting, deep charcoal void background removed for transparency, no text, no logos, premium product visualization, photoreal-CGI hybrid, not cartoon, not cyberpunk neon overload",
    aspectRatio: "1:1",
    resolution: "2048x2048",
    transparent: true,
    placement: "Landing hero visual stage (right/center overlap on desktop)",
    crop: "Keep subject centered with 8-12% padding; preserve full rings",
    animation:
      "Slow CSS/Framer rotate on rings (40-60s), subtle float Y, parallax to pointer; opacity fade-in on load",
    mobileFallback:
      "Scale down to 70%, disable parallax, keep slow float only; or show static WebP",
    path: "/visuals/hero-orbit.webp",
  },
  heroAtmosphere: {
    id: "hero-atmosphere",
    purpose: "Full-bleed cinematic depth plate behind hero content.",
    prompt:
      "Ultra-wide dark graphite GameTech environment, soft teal rim light from upper right, subtle technical grid fading into fog, volumetric haze, no people, no UI text, cinematic still suitable as website background plate, low chroma, premium",
    aspectRatio: "21:9",
    resolution: "3840x1646",
    transparent: false,
    placement: "Hero background layer under grain/grid overlays",
    crop: "Safe center; avoid busy detail in lower-left text zone",
    animation: "Very slow Ken Burns scale 1.0→1.06 via Motion scrub optional; mostly static",
    mobileFallback: "Crop to center 9:16 or solid gradient + grid only",
    path: "/visuals/hero-atmosphere.webp",
  },
  pipelinePanels: {
    id: "pipeline-panels",
    purpose: "Abstract HUD panel cluster illustrating the analysis pipeline.",
    prompt:
      "Five overlapping translucent perspective UI panels floating in dark space, teal accents, holographic glass edges, game-market data motifs without readable fake text, premium GameTech product art, transparent background",
    aspectRatio: "16:9",
    resolution: "2400x1350",
    transparent: true,
    placement: "How-it-works section ambient backdrop or side visual",
    crop: "Full cluster with breathing room",
    animation: "Staggered float + slight perspective tilt on scroll reveal",
    mobileFallback: "Hide decorative cluster; keep interactive showcase only",
    path: "/visuals/pipeline-panels.webp",
  },
  analyzeGlow: {
    id: "analyze-glow",
    purpose: "Conversion section atmospheric side light / abstract structure.",
    prompt:
      "Abstract floating crystalline scanning prism with soft teal caustics, dark void, transparent PNG, premium tech product still, no text",
    aspectRatio: "4:5",
    resolution: "1600x2000",
    transparent: true,
    placement: "Analyze section right column decorative",
    crop: "Subject mid-frame, soft falloff edges",
    animation: "Idle float + light pulse opacity 0.7-1.0",
    mobileFallback: "Omit; rely on form panel alone",
    path: "/visuals/analyze-glow.webp",
  },
  reportCommand: {
    id: "report-command",
    purpose: "Optional progress-screen centerpiece while analysis stages run.",
    prompt:
      "Dark holographic command lens scanning Steam-like market signals, teal scanlines restrained, transparent background, premium GameTech object, no logos",
    aspectRatio: "1:1",
    resolution: "1536x1536",
    transparent: true,
    placement: "Analysis progress state above checklist",
    crop: "Centered subject",
    animation: "Slow rotation + scan shimmer CSS",
    mobileFallback: "Static reduced size",
    path: "/visuals/report-command.webp",
  },
} as const satisfies Record<string, VisualAssetSpec>;
