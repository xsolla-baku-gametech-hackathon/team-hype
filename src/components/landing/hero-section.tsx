"use client";

import { motion, useReducedMotion } from "motion/react";

import { BackgroundEffects } from "@/components/landing/background-effects";
import { CTAButtons } from "@/components/landing/cta-buttons";
import { HeroOrbit } from "@/components/landing/hero-orbit";
import { Container } from "@/components/layout/container";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/site-config";

/**
 * Immersive first viewport — overlapping brand + orbit composition.
 * Showcase and form live in dedicated sections below.
 */
export function HeroSection() {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="product"
      className="relative min-h-[100dvh] overflow-hidden pb-16 sm:pb-20"
    >
      <BackgroundEffects />

      <Container className="relative grid min-h-[calc(100dvh-5.5rem)] items-center gap-10 pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 lg:pt-6">
        <div className="relative z-10 max-w-xl lg:max-w-none">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9] font-bold tracking-[-0.04em] text-white"
          >
            {APP_NAME}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-5 max-w-[16ch] text-2xl leading-tight font-medium tracking-tight text-balance text-white/90 sm:text-3xl lg:text-[2rem]"
          >
            {APP_TAGLINE}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease }}
            className="mt-4 max-w-[38ch] text-base leading-relaxed text-pretty text-white/50 sm:text-[17px]"
          >
            {APP_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-8"
          >
            <CTAButtons />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.12, ease }}
          className="relative z-0 mx-auto w-full max-w-[520px] lg:max-w-none lg:translate-x-4 lg:-translate-y-2"
        >
          <HeroOrbit className="mx-auto" />
        </motion.div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
      />
    </section>
  );
}
