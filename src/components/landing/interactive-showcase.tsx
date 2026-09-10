"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SHOWCASE_SLIDES } from "@/components/landing/showcase-data";
import { ShowcaseSlide } from "@/components/landing/showcase-slide";
import { Reveal } from "@/components/shared/reveal";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";

const AUTO_ADVANCE_MS = 5200;

/**
 * How-it-works: editorial headline + living pipeline carousel.
 * Preserves slide data, auto-advance, and keyboard/mouse controls.
 */
export function InteractiveShowcase() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    const next = (index + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length;
    setActiveIndex(next);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduce]);

  // Horizontal-only centering inside the track. Never use scrollIntoView —
  // even with block: "nearest" it scrolls the document when the carousel
  // is below the fold (mount + auto-advance were jumping the homepage).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>(
      `[data-slide-index="${activeIndex}"]`,
    );
    if (!active) return;

    const targetLeft =
      active.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;

    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex, reduce]);

  const activeSlide = SHOWCASE_SLIDES[activeIndex];

  return (
    <section
      id="how-it-works"
      aria-label="How GameLens works"
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,oklch(0.5_0.08_185_/_0.12),transparent_60%)]"
      />

      <Container>
        <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
              Pipeline
            </h2>
            <p className="mt-4 max-w-[42ch] text-base text-pretty text-white/45 sm:text-lg">
              From concept brief to evidence-backed decisions. Five stages that stay
              traceable to real Steam player voice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden min-h-[2.5rem] min-w-[12rem] max-w-xs items-center justify-end md:flex">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeSlide.id}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-0 text-right text-sm leading-snug text-pretty text-white/40"
                >
                  <span className="font-mono text-accent/80">{activeSlide.step}</span>
                  <span className="mx-2 text-white/20">/</span>
                  {activeSlide.title}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-accent/35 hover:text-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-accent/35 hover:text-white"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16"
        />

        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1rem,calc(50%-170px))] py-4 sm:gap-5"
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

      <Container>
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Showcase slides"
        >
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
      </Container>
    </section>
  );
}
