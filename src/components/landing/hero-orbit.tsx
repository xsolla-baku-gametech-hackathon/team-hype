"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type MouseEvent } from "react";

import {
  HERO_SUPPORT_FRAGMENTS,
  VISUAL_ASSETS,
} from "@/lib/visual-assets";
import { cn } from "@/lib/utils/cn";

/**
 * Immersive hero centerpiece: transparent GameTech core + orbiting fragments.
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.16_280_/_0.28),oklch(0.55_0.12_230_/_0.12)_45%,transparent_70%)] blur-2xl"
      />

      {HERO_SUPPORT_FRAGMENTS.map((fragment) => (
        <SupportFragment
          key={fragment.asset.id}
          src={fragment.asset.path}
          className={fragment.className}
          floatDuration={fragment.floatDuration}
          parallax={fragment.parallax}
          mx={mx}
          my={my}
          reduce={!!reduce}
        />
      ))}

      <motion.div
        className="absolute inset-[10%] z-10 will-change-transform"
        style={reduce ? undefined : { transform }}
        aria-hidden="true"
      >
        <motion.div
          className="size-full"
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={VISUAL_ASSETS.heroOrbit.path}
            alt=""
            className="size-full object-contain drop-shadow-[0_0_48px_oklch(0.55_0.16_280_/_0.45)]"
            onError={(event) => {
              event.currentTarget.src = VISUAL_ASSETS.heroCoreAlt.path;
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function SupportFragment({
  src,
  className,
  floatDuration,
  parallax,
  mx,
  my,
  reduce,
}: {
  src: string;
  className: string;
  floatDuration: number;
  parallax: number;
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
  reduce: boolean;
}) {
  const x = useTransform(mx, (value) => value * parallax);
  const y = useTransform(my, (value) => value * parallax);

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-[5] will-change-transform", className)}
      style={reduce ? undefined : { x, y }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="size-full object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        />
      </motion.div>
    </motion.div>
  );
}
