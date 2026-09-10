"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type MouseEvent } from "react";

import { VISUAL_ASSETS } from "@/lib/visual-assets";
import { cn } from "@/lib/utils/cn";

/**
 * Immersive hero centerpiece. Prefers generated WebP at
 * `/visuals/hero-orbit.webp`; falls back to procedural orbital HUD.
 */
export function HeroOrbit({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });
  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 18);
    my.set(py * 12);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      className={cn("relative aspect-square w-full max-w-[560px]", className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduce ? undefined : { transform }}
        aria-hidden="true"
      >
        {/* Generated asset slot — transparent WebP when available */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VISUAL_ASSETS.heroOrbit.path}
          alt=""
          className="absolute inset-[8%] z-10 size-[84%] object-contain opacity-90"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0">
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.12_185_/_0.22),transparent_62%)] blur-2xl" />

          <motion.div
            className="absolute inset-[6%] rounded-full border border-accent/25"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 48, ease: "linear", repeat: Infinity }}
          >
            <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_var(--accent-glow)]" />
          </motion.div>

          <motion.div
            className="absolute inset-[16%] rounded-full border border-dashed border-white/15"
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 64, ease: "linear", repeat: Infinity }}
          />

          <motion.div
            className="absolute inset-[28%] rounded-full border border-white/10"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 36, ease: "linear", repeat: Infinity }}
          >
            <span className="absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
          </motion.div>

          <div className="absolute inset-[38%] overflow-hidden rounded-full border border-accent/35 bg-[#0a0e14]/80 panel-bevel">
            <div className="absolute inset-0 bg-[conic-gradient(from_210deg,transparent,oklch(0.78_0.13_185_/_0.35),transparent_40%)] opacity-70" />
            <div className="absolute inset-[18%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,oklch(0.85_0.08_185_/_0.35),transparent_55%)]" />
            <div className="absolute inset-[36%] rounded-full border border-accent/50 bg-accent/20" />
          </div>

          {/* Floating HUD fragments */}
          <motion.div
            className="absolute top-[18%] right-[4%] w-[38%] rounded-lg border border-white/10 bg-[#0c1118]/75 p-3 backdrop-blur-sm"
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-2 h-1 w-10 rounded-full bg-accent/60" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-white/10" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
              <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-[16%] left-[2%] w-[34%] rounded-lg border border-white/10 bg-[#0c1118]/75 p-3 backdrop-blur-sm"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] tracking-wider text-accent/80">SIGNAL</span>
              <span className="font-mono text-[10px] text-white/40">92%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[92%] rounded-full bg-accent" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
