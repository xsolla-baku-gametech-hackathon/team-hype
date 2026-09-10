/**
 * Layered atmosphere for the landing hero - blue/violet depth matching
 * GameTech assets, wide radial lighting, technical grid.
 */
export function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#08090c]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,oklch(0.42_0.1_280_/_0.28),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_18%_30%,oklch(0.4_0.08_230_/_0.2),transparent_55%)]" />
      <div className="absolute top-[20%] left-[50%] h-[480px] w-[min(95vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.58_0.12_250_/_0.2),transparent_70%)] blur-3xl" />

      <div className="absolute inset-0 hud-grid opacity-70 [mask-image:radial-gradient(ellipse_80%_65%_at_55%_40%,#000_10%,transparent_75%)]" />

      {/* Soft horizontal energy wash */}
      <div className="absolute top-[48%] inset-x-0 h-24 bg-gradient-to-r from-transparent via-accent/8 to-transparent blur-2xl" />

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}
