"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import {
  HERO_ORBIT_NODES,
  VISUAL_ASSETS,
} from "@/lib/visual-assets";
import { cn } from "@/lib/utils/cn";

/**
 * Full-viewport immersive hero stage: atmosphere + oversized core +
 * orbital process nodes. Core is deliberately large so the first
 * frame feels filled, not cropped short.
 */
export function HeroOrbit({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const coreTransform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  useEffect(() => {
    if (reduce || !stageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".hero-ring-a", {
        rotate: 360,
        duration: 48,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".hero-ring-b", {
        rotate: -360,
        duration: 64,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".hero-ring-c", {
        rotate: 360,
        duration: 36,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".hero-scan", {
        rotate: 360,
        duration: 14,
        ease: "none",
        repeat: -1,
      });
      gsap.fromTo(
        ".hero-flow-beam",
        { xPercent: -30, opacity: 0.15 },
        {
          xPercent: 30,
          opacity: 0.55,
          duration: 4.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.7,
        },
      );
      gsap.to(".hero-glow-pulse", {
        opacity: 0.55,
        scale: 1.08,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".hero-atmosphere", {
        xPercent: 3,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, stageRef);

    return () => ctx.revert();
  }, [reduce]);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 28);
    my.set(py * 18);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative h-full min-h-[100dvh] w-full overflow-hidden",
        className,
      )}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden="true"
    >
      {/* Wide atmospheric plate — oversized + heavily feathered so its
          own photo edges never surface inside the viewport. */}
      <div className="pointer-events-none absolute -inset-[35%] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VISUAL_ASSETS.heroAtmosphere.path}
          alt=""
          className="hero-atmosphere absolute inset-0 size-full scale-[1.6] object-cover opacity-35 blur-[6px] [mask-image:radial-gradient(ellipse_55%_50%_at_58%_48%,#000_0%,transparent_60%)]"
        />
        <div className="hero-glow-pulse absolute top-[24%] left-[48%] h-[55%] w-[55%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.16_280_/_0.4),oklch(0.55_0.12_230_/_0.14)_42%,transparent_70%)] blur-3xl" />
      </div>

      {/* Base fill so the atmosphere plate always sits on a matching
          solid backdrop — removes any hard rectangle at its bounds. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#08090c]" />

      {/* Horizontal process-flow beams */}
      <div className="pointer-events-none absolute inset-x-0 top-[48%] hidden h-px sm:block">
        <div className="hero-flow-beam absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="hero-flow-beam absolute top-6 inset-x-[8%] h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.16_280_/_0.45)] to-transparent" />
        <div className="hero-flow-beam absolute -top-5 inset-x-[15%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* Elliptical orbit rings — scaled to the taller stage */}
      <div className="pointer-events-none absolute top-[52%] left-[55%] h-[min(92vw,720px)] w-[min(130vw,980px)] -translate-x-1/2 -translate-y-1/2">
        <div className="hero-ring-a absolute inset-0 rounded-[50%] border border-accent/20 [transform:rotateX(62deg)]" />
        <div className="hero-ring-b absolute inset-[8%] rounded-[50%] border border-dashed border-white/15 [transform:rotateX(62deg)]" />
        <div className="hero-ring-c absolute inset-[18%] rounded-[50%] border border-[oklch(0.62_0.16_280_/_0.22)] [transform:rotateX(62deg)]" />
        <div className="hero-scan absolute inset-[4%] rounded-[50%] [transform:rotateX(62deg)]">
          <div className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_22px_var(--accent-glow)]" />
        </div>
      </div>

      {HERO_ORBIT_NODES.map((node) => (
        <OrbitNode
          key={node.asset.id}
          src={node.asset.path}
          className={cn(
            node.className,
            !node.showOnMobile && "hidden sm:block",
          )}
          floatDuration={node.floatDuration}
          parallax={node.parallax}
          mx={mx}
          my={my}
          reduce={!!reduce}
        />
      ))}

      {/* Central core — dominant scale so it never reads as a tiny crop */}
      <div className="absolute top-[48%] left-[52%] z-10 w-[min(92vw,680px)] -translate-x-1/2 -translate-y-1/2 sm:top-[50%] sm:w-[min(78vw,760px)] lg:left-[58%] lg:w-[min(62vw,820px)]">
        <motion.div
          className="relative aspect-square w-full will-change-transform"
          style={reduce ? undefined : { transform: coreTransform }}
        >
          <motion.div
            className="relative size-full"
            animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={VISUAL_ASSETS.heroOrbit.path}
              alt=""
              className="relative z-10 size-full scale-[1.12] object-contain drop-shadow-[0_0_80px_oklch(0.55_0.16_280_/_0.55)] sm:scale-[1.18]"
              onError={(event) => {
                event.currentTarget.src = VISUAL_ASSETS.heroCoreAlt.path;
              }}
            />
            <div className="pointer-events-none absolute inset-[12%] -z-10 rounded-full bg-[radial-gradient(circle,oklch(0.65_0.14_250_/_0.4),transparent_70%)] blur-3xl" />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_85%_at_55%_48%,transparent_30%,var(--background)_88%)]" />
    </div>
  );
}

function OrbitNode({
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
      className={cn(
        "pointer-events-none absolute z-[5] will-change-transform",
        className,
      )}
      style={reduce ? undefined : { x, y }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0], x: [0, 6, 0] }}
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
