"use client";

import { motion, useReducedMotion } from "motion/react";

import { BackgroundEffects } from "@/components/landing/background-effects";
import { CTAButtons } from "@/components/landing/cta-buttons";
import { HeroOrbit } from "@/components/landing/hero-orbit";
import { Container } from "@/components/layout/container";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/site-config";

/**
 * Immersive first viewport — one continuous full-bleed stage.
 * Visual fills the entire frame; copy rides on top of the left edge.
 */
export function HeroSection() {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="product"
      className="relative isolate min-h-[100dvh] overflow-hidden"
    >
      <BackgroundEffects />

      {/* Full-bleed visual plane — truly edge to edge, so the atmosphere
          and vignette reach the left edge instead of leaving a bare
          strip. Composition is shifted right via inner element offsets
          in HeroOrbit, not by cropping this wrapper. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute inset-0">
          <HeroOrbit className="h-full min-h-[100dvh]" />
        </div>
      </div>

      <Container className="relative z-20 flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-32 lg:justify-center lg:pb-24 lg:pt-24">
        <div className="max-w-xl lg:max-w-[30rem]">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[clamp(3.25rem,10vw,6rem)] leading-[0.95] font-bold tracking-[-0.045em] text-balance text-white drop-shadow-[0_12px_48px_rgba(0,0,0,0.75)]"
          >
            {APP_NAME}
            <span className="sr-only"> — {APP_TAGLINE}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-5 max-w-[16ch] text-2xl leading-snug font-medium tracking-tight text-balance text-white/92 sm:mt-6 sm:text-3xl lg:text-[2rem]"
          >
            {APP_TAGLINE}
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease }}
            className="mt-4 max-w-[36ch] text-base leading-relaxed text-pretty text-white/55 sm:text-[17px]"
          >
            {APP_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="mt-8 sm:mt-9"
          >
            <CTAButtons />
          </motion.div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-background via-background/70 to-transparent"
      />
    </section>
  );
}
