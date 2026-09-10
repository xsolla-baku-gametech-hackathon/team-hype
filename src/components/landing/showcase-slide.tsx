"use client";

import { motion, useReducedMotion } from "motion/react";

import type { ShowcaseSlideData } from "@/components/landing/showcase-data";
import { cn } from "@/lib/utils/cn";

const ACCENT_TEXT: Record<ShowcaseSlideData["accent"], string> = {
  accent: "text-accent",
  cyan: "text-accent",
  positive: "text-positive",
  negative: "text-negative",
  opportunity: "text-opportunity",
};

const ACCENT_SURFACE: Record<ShowcaseSlideData["accent"], string> = {
  accent: "bg-accent/12 border-accent/30",
  cyan: "bg-accent/10 border-accent/25",
  positive: "bg-positive/10 border-positive/25",
  negative: "bg-negative/10 border-negative/25",
  opportunity: "bg-opportunity/10 border-opportunity/25",
};

const SIGNAL_TONE: Record<ShowcaseSlideData["signals"][number]["tone"], string> = {
  accent: "border-accent/25 bg-accent/10 text-accent",
  cyan: "border-accent/20 bg-accent/8 text-accent/90",
  positive: "border-positive/25 bg-positive/10 text-positive",
  negative: "border-negative/25 bg-negative/10 text-negative",
  opportunity: "border-opportunity/25 bg-opportunity/10 text-opportunity",
};

interface ShowcaseSlideProps {
  slide: ShowcaseSlideData;
  isActive: boolean;
  onSelect: () => void;
}

export function ShowcaseSlide({ slide, isActive, onSelect }: ShowcaseSlideProps) {
  const Icon = slide.icon;
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      aria-label={`${slide.title}: ${slide.description}`}
      className={cn(
        "group relative w-[min(78vw,300px)] shrink-0 snap-center overflow-hidden rounded-xl border text-left transition-[box-shadow,opacity] duration-500 sm:w-[340px]",
        isActive
          ? "border-accent/30 bg-[#0c1118]/95 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.9),0_0_40px_-20px_var(--accent-glow)]"
          : "border-white/[0.07] bg-[#0a0e14]/70 opacity-55 hover:opacity-85",
      )}
      animate={
        reduce
          ? { scale: 1, y: 0, rotateY: 0 }
          : {
              scale: isActive ? 1 : 0.92,
              y: isActive ? 0 : 16,
              rotateY: isActive ? 0 : -4,
            }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
      }
      style={{ transformPerspective: 900 }}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-20",
        )}
      />

      <div className="relative flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border",
              ACCENT_SURFACE[slide.accent],
              ACCENT_TEXT[slide.accent],
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-white/35">
            {slide.step}
          </span>
        </div>

        <div className="space-y-2">
          <span className="block text-[15px] font-semibold tracking-tight text-white">
            {slide.title}
          </span>
          <p className="text-sm leading-relaxed text-white/50">{slide.description}</p>
        </div>

        <div
          className={cn(
            "relative mt-auto overflow-hidden rounded-lg border border-white/[0.08] bg-black/35 p-4",
            isActive && "shadow-[inset_0_1px_0_oklch(1_0_0_/_0.06)]",
          )}
        >
          <p className={cn("text-[11px] font-medium tracking-wide uppercase", ACCENT_TEXT[slide.accent])}>
            {slide.preview.eyebrow}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{slide.preview.body}</p>
          <p className="mt-3 text-[11px] text-white/35">{slide.preview.meta}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {slide.signals.map((signal) => (
            <span
              key={signal.label}
              className={cn(
                "rounded-md border px-2 py-0.5 text-[10px] font-medium tracking-wide",
                SIGNAL_TONE[signal.tone],
              )}
            >
              {signal.label}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
