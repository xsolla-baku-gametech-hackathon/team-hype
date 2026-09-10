/**
 * Layered atmosphere for the landing hero — teal depth, technical grid, no violet haze.
 */
export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#08090c]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_70%_35%,oklch(0.45_0.08_185_/_0.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_20%,oklch(0.35_0.04_250_/_0.35),transparent_55%)]" />
      <div className="absolute top-[30%] left-[55%] h-[380px] w-[min(70vw,640px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.65_0.12_185_/_0.18),transparent_70%)] blur-3xl" />

      <div className="absolute inset-0 hud-grid [mask-image:radial-gradient(ellipse_75%_60%_at_60%_40%,#000_15%,transparent_72%)]" />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
