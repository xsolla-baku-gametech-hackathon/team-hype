"use client";

import { motion } from "motion/react";

import { BackgroundEffects } from "@/components/landing/background-effects";
import { ConceptForm } from "@/components/landing/concept-form";
import { CTAButtons } from "@/components/landing/cta-buttons";
import { InteractiveShowcase } from "@/components/landing/interactive-showcase";
import { TRUST_SIGNALS } from "@/components/landing/showcase-data";
import { Container } from "@/components/layout/container";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/site-config";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Landing above-the-fold: identity, promise, CTAs, and the interactive
 * product-story showcase that sells the pipeline in one glance.
 */
export function HeroSection() {
  return (
    <section id="product" className="relative overflow-hidden pb-20 sm:pb-28">
      <BackgroundEffects />

      <Container className="relative flex flex-col items-center pt-14 text-center sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-5 text-[11px] font-medium tracking-[0.28em] text-sky-300/75 uppercase sm:mb-6"
        >
          {APP_NAME} · GameTech intelligence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease }}
          className="max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-6xl"
        >
          {APP_TAGLINE}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:mt-6 sm:text-lg"
        >
          {APP_DESCRIPTION}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease }}
          className="mt-8 sm:mt-10"
        >
          <CTAButtons />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] tracking-wide text-white/35"
        >
          {TRUST_SIGNALS.map((signal, index) => (
            <li key={signal} className="inline-flex items-center gap-3">
              {index > 0 ? (
                <span aria-hidden="true" className="size-1 rounded-full bg-white/20" />
              ) : null}
              {signal}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease }}
          className="mt-14 w-full max-w-6xl sm:mt-16"
        >
          <InteractiveShowcase />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
          className="mt-8 max-w-xl text-sm text-white/40"
        >
          Describe → compare → understand players → uncover gaps → decide with evidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease }}
          className="mt-14 w-full sm:mt-16"
        >
          <ConceptForm />
        </motion.div>
      </Container>
    </section>
  );
}
