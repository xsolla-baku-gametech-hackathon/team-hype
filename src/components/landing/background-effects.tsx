/**
 * Layered atmosphere for the landing hero — depth without neon overload.
 * Purely decorative; kept aria-hidden so it never competes with content.
 */
export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050507]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.35_0.08_275_/_0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,oklch(0.45_0.1_230_/_0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_15%_60%,oklch(0.4_0.06_275_/_0.1),transparent_55%)]" />

      <div className="absolute top-[42%] left-1/2 h-[420px] w-[min(90vw,920px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.5_0.14_275_/_0.22),oklch(0.45_0.1_230_/_0.08)_40%,transparent_70%)] blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,#000_20%,transparent_75%)]" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
