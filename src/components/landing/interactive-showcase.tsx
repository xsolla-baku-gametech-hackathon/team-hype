"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { SHOWCASE_SLIDES } from "@/components/landing/showcase-data";
import { ShowcaseSlide } from "@/components/landing/showcase-slide";
import { Reveal } from "@/components/shared/reveal";
import { Container } from "@/components/layout/container";
import { APP_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const AUTO_ADVANCE_MS = 5200;
const LAST_INDEX = SHOWCASE_SLIDES.length - 1;

/**
 * How-it-works: editorial headline + living pipeline carousel.
 *
 * Desktop (lg+): the card track is pinned and driven by GSAP
 * ScrollTrigger — cards slide horizontally as the *page itself*
 * scrolls (scrub tied 1:1 to scroll position), then release back into
 * normal vertical scroll once the last card is reached. This is scroll
 * itself, not a separate timer/carousel animation layered on top.
 *
 * Mobile/reduced-motion: falls back to the original swipeable,
 * snap-scrolling, auto-advancing track.
 */
export function InteractiveShowcase() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const paused = userPaused || hoverPaused;

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const pinnedRef = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length;
      setActiveIndex(next);

      const st = scrollTriggerRef.current;
      if (pinnedRef.current && st) {
        const progress = LAST_INDEX > 0 ? next / LAST_INDEX : 0;
        const y = st.start + progress * (st.end - st.start);
        if (reduce) {
          window.scrollTo(0, y);
        } else {
          gsap.to(window, {
            duration: 0.9,
            ease: "power3.inOut",
            scrollTo: { y, autoKill: true },
          });
        }
        return;
      }

      const stage = stageRef.current;
      if (!stage) return;
      const active = stage.querySelector<HTMLElement>(
        `[data-slide-index="${next}"]`,
      );
      if (!active) return;
      const targetLeft =
        active.getBoundingClientRect().left -
        stage.getBoundingClientRect().left +
        stage.scrollLeft -
        (stage.clientWidth - active.offsetWidth) / 2;
      stage.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  // Auto-advance only drives the mobile/fallback track. Once the
  // desktop scroll-pin takes over, the user's own scrolling is the
  // "auto-advance" — a timer fighting it would feel broken.
  useEffect(() => {
    if (paused || reduce || pinned) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduce, pinned]);

  // Mobile/fallback: center the active card in the native horizontal
  // scroller. Never use scrollIntoView — it can scroll the document.
  useEffect(() => {
    if (pinned) return;
    const stage = stageRef.current;
    if (!stage) return;
    const active = stage.querySelector<HTMLElement>(
      `[data-slide-index="${activeIndex}"]`,
    );
    if (!active) return;
    const targetLeft =
      active.getBoundingClientRect().left -
      stage.getBoundingClientRect().left +
      stage.scrollLeft -
      (stage.clientWidth - active.offsetWidth) / 2;
    stage.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex, reduce, pinned]);

  // Desktop: pin the stage and translate the track by exactly the
  // scroll distance the user contributes, so the card reveal is a
  // literal fragment of the page's scroll, not an independent tween.
  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const pinWrap = pinWrapRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !pinWrap || !stage || !track) return;

    let cancelled = false;
    let mm: ReturnType<typeof gsap.matchMedia> | undefined;

    async function setup() {
      // Wait for fonts before measuring scrollWidth/clientHeight — a
      // font swap after mount reflows card text and was throwing the
      // pin distance/height math off (part of the reported bug).
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }
      if (cancelled) return;

      mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!track || !stage || !pinWrap) return;
        setPinned(true);
        pinnedRef.current = true;

        const distance = () =>
          Math.max(0, track.scrollWidth - stage.clientWidth);

        // Pin the heading + cards *together* (not just the card stage)
        // so the cards never drift away from directly under the
        // heading — the whole block holds its layout while only the
        // track slides horizontally underneath.
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: pinWrap,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.round(self.progress * LAST_INDEX);
              setActiveIndex((current) =>
                current === index ? current : index,
              );
            },
          },
        });

        scrollTriggerRef.current = tween.scrollTrigger ?? null;
        ScrollTrigger.refresh();

        return () => {
          scrollTriggerRef.current = null;
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "x" });
        };
      });

      mm.add("(max-width: 1023px)", () => {
        setPinned(false);
        pinnedRef.current = false;
        return () => {};
      });
    }

    void setup();

    function onResize() {
      ScrollTrigger.refresh();
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      mm?.revert();
    };
  }, [reduce]);

  const activeSlide = SHOWCASE_SLIDES[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-label={`How ${APP_NAME} works`}
      className="relative scroll-mt-28 overflow-hidden py-24 sm:py-32 lg:py-0"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHoverPaused(false);
        }
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,oklch(0.5_0.08_185_/_0.12),transparent_60%)]"
      />

      {/*
       * Heading + card stage live in one pinned block (`pinWrapRef`) so
       * the cards never separate from the heading while scrubbing —
       * only the track slides horizontally inside it. `section` itself
       * has no fixed height, so GSAP's pin-spacer can grow it by
       * exactly the horizontal-scroll distance without overlapping the
       * next section.
       */}
      <div ref={pinWrapRef} className="relative">
        <Container className="pt-2 lg:pt-16">
          <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl">
                Pipeline
              </h2>
              <p className="mt-4 max-w-[42ch] text-base text-pretty text-white/45 sm:text-lg">
                From concept brief to evidence-backed decisions. Five stages that
                stay traceable to real Steam player voice.
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
                  onClick={() => setUserPaused((value) => !value)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs text-white/70 transition-colors hover:border-accent/35 hover:text-white"
                  aria-pressed={userPaused}
                  aria-label={
                    userPaused
                      ? "Play showcase auto-advance"
                      : "Pause showcase auto-advance"
                  }
                >
                  {userPaused ? "Play" : "Pause"}
                </button>
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

          {/* Stage: scrolls natively on mobile; becomes the clipped
              viewport on lg+ while `track` is transformed. Height stays
              content-driven (card height) — no full-screen centering,
              so cards sit right under the heading, not floating lower. */}
          <div
            ref={stageRef}
            className="scrollbar-none w-full overflow-x-auto lg:overflow-hidden"
          >
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-4 px-[max(1rem,calc(50%-170px))] py-4 sm:gap-5 lg:snap-none lg:will-change-transform"
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
        </div>
      </div>

      <Container className="lg:pb-16">
        <div
          className="mt-8 flex items-center justify-center gap-2 lg:mt-0"
          role="group"
          aria-label="Showcase slides"
          onKeyDown={(event) => {
            let delta: number | null = null;
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              delta = 1;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              delta = -1;
            } else if (event.key === "Home") {
              delta = -activeIndex;
            } else if (event.key === "End") {
              delta = LAST_INDEX - activeIndex;
            }
            if (delta === null) return;

            event.preventDefault();
            const next =
              (activeIndex + delta + SHOWCASE_SLIDES.length) %
              SHOWCASE_SLIDES.length;
            goTo(next);
            const dots =
              event.currentTarget.querySelectorAll<HTMLElement>("button");
            dots[next]?.focus();
          }}
        >
          {SHOWCASE_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={`Show ${slide.title}`}
              onClick={() => goTo(index)}
              className="group flex size-10 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-full transition-[width,height,background-color] duration-500",
                  index === activeIndex
                    ? "h-1.5 w-8 bg-accent"
                    : "size-1.5 bg-white/20 group-hover:bg-white/35",
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
