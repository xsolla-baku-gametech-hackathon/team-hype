"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

import { Reveal } from "@/components/shared/reveal";
import { Container } from "@/components/layout/container";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  "Describe",
  "Compare",
  "Understand players",
  "Uncover gaps",
  "Decide with evidence",
] as const;

/**
 * Large typographic storytelling strip between pipeline and conversion.
 */
export function PipelineStrip() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".pipeline-word");
      gsap.fromTo(
        words,
        { opacity: 0.18, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "center 40%",
            scrub: 0.6,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      aria-label="Decision pipeline"
      className="relative overflow-hidden border-y border-white/[0.06] py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hud-grid opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      />
      <Container>
        <Reveal>
          <p className="max-w-xl text-sm text-white/40 sm:text-base">
            The pitch-room path, compressed into one read.
          </p>
        </Reveal>
        <ol className="mt-10 flex flex-col gap-4 sm:gap-5">
          {STAGES.map((stage, index) => (
            <li
              key={stage}
              className="pipeline-word flex items-baseline gap-4 sm:gap-6"
            >
              <span className="font-mono text-xs text-accent/70 sm:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-3xl leading-none font-semibold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                {stage}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
