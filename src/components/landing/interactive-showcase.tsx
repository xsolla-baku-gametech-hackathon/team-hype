"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SHOWCASE_SLIDES } from "@/components/landing/showcase-data";
import { ShowcaseSlide } from "@/components/landing/showcase-slide";
import { cn } from "@/lib/utils/cn";

const AUTO_ADVANCE_MS = 5200;

/**
 * Wide, center-focused product story carousel. Neighbors stay partially
 * visible so the strip reads as a living pipeline, not a single card.
 */
export function InteractiveShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const next = (index + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length;
    setActiveIndex(next);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>(`[data-slide-index="${activeIndex}"]`);
    if (!active) return;
    active.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  const activeSlide = SHOWCASE_SLIDES[activeIndex];

  return (
    <section
      id="how-it-works"
      aria-label="How GameLens works"
      className="relative w-full scroll-mt-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="mb-6 flex items-end justify-between gap-4 px-1 sm:mb-8">
        <div className="min-w-0 text-left">
          <p className="text-[11px] font-medium tracking-[0.22em] text-sky-300/70 uppercase">
            Product story
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlide.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1.5 truncate text-sm text-white/55 sm:text-base"
            >
              {activeSlide.title}
              <span className="text-white/25"> — </span>
              {activeSlide.preview.meta}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#050507] to-transparent sm:w-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#050507] to-transparent sm:w-20"
        />

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1rem,calc(50%-170px))] py-4 scrollbar-none sm:gap-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SHOWCASE_SLIDES.map((slide, index) => (
            <div key={slide.id} data-slide-index={index} className="snap-center">
              <ShowcaseSlide
                slide={slide}
                isActive={index === activeIndex}
                onSelect={() => goTo(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Showcase slides">
        {SHOWCASE_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${slide.title}`}
            onClick={() => goTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              index === activeIndex
                ? "w-8 bg-accent"
                : "w-1.5 bg-white/20 hover:bg-white/35",
            )}
          />
        ))}
      </div>
    </section>
  );
}
