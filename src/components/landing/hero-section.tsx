"use client";

import { motion, useReducedMotion } from "motion/react";

import { BackgroundEffects } from "@/components/landing/background-effects";
import { CTAButtons } from "@/components/landing/cta-buttons";
import { HeroOrbit } from "@/components/landing/hero-orbit";
import { Container } from "@/components/layout/container";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/site-config";

/**
 * Unified immersive first viewport - one continuous stage, not a
 * left-text / right-image split. Copy overlays the wide visual field.
 */
export function HeroSection() {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="product"
      className="relative min-h-[100dvh] overflow-hidden pb-10 sm:pb-14"
    >
      <BackgroundEffects />

      <Container className="relative flex min-h-[calc(100dvh-5.5rem)] flex-col justify-end pt-6 sm:pt-8 lg:justify-center lg:pt-4">
        {/* Full-bleed visual stage sits behind / beside copy as one canvas */}
        <div className="pointer-events-none absolute inset-x-0 top-[8%] bottom-[8%] sm:top-[4%] sm:bottom-[6%] lg:inset-y-0">
          <div className="pointer-events-auto h-full w-full lg:ml-[18%] lg:w-[82%]">
            <HeroOrbit className="h-full" />
          </div>
        </div>

        <div className="relative z-20 max-w-xl pb-6 pt-[42vh] sm:pb-8 sm:pt-[38vh] lg:max-w-[28rem] lg:pt-0 lg:pb-4">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
            className="font-display text-[clamp(2.75rem,8vw,5.25rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.65)]"
          >
            {APP_NAME}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-4 max-w-[16ch] text-2xl leading-snug font-medium tracking-tight text-balance text-white/92 sm:mt-5 sm:text-3xl lg:text-[1.9rem]"
          >
            {APP_TAGLINE}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease }}
            className="mt-4 max-w-[36ch] text-base leading-relaxed text-pretty text-white/55 sm:text-[17px]"
          >
            {APP_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease }}
            className="mt-7 sm:mt-8"
          >
            <CTAButtons />
          </motion.div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  );
}
