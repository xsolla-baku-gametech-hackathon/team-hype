"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { formatNumber } from "@/lib/utils/format";
import type { AnalysisSummaryMetrics } from "@/lib/analysis/types";

interface MetricsRowProps {
  summary: AnalysisSummaryMetrics;
}

interface Metric {
  readonly value: number;
  readonly label: string;
}

function AnimatedValue({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 24 });

  useEffect(() => {
    if (reduce) {
      motionValue.set(value);
      return;
    }
    if (inView) motionValue.set(value);
  }, [inView, motionValue, reduce, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(Math.round(latest));
      }
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduce ? formatNumber(value) : "0"}
    </span>
  );
}

/** Oversized metric strip — GameTech command console energy. */
export function MetricsRow({ summary }: MetricsRowProps) {
  const reduce = useReducedMotion();
  const metrics: readonly Metric[] = [
    { value: summary.comparableGamesCount, label: "Comparable Games" },
    { value: summary.reviewsAnalyzedCount, label: "Reviews Analyzed" },
    { value: summary.recurringThemesDetected, label: "Recurring Themes" },
    { value: summary.marketOpportunitiesCount, label: "Market Opportunities" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.45,
            delay: index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-surface px-4 py-5 panel-bevel"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <dd className="font-display text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
            <AnimatedValue value={metric.value} />
          </dd>
          <dt className="mt-2 text-[11px] tracking-wide text-muted-foreground uppercase sm:text-xs">
            {metric.label}
          </dt>
        </motion.div>
      ))}
    </dl>
  );
}
