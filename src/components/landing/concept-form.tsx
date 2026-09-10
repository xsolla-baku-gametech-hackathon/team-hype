"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Monitor, ScanSearch, Smartphone, Tv } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Reveal } from "@/components/shared/reveal";
import { Magnetic } from "@/components/shared/magnetic";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CONCEPT_PLACEHOLDER,
  GENRE_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/lib/analysis/constants";
import { conceptFormSchema } from "@/lib/analysis/types";
import { VISUAL_ASSETS } from "@/lib/visual-assets";
import { cn } from "@/lib/utils/cn";

const MIN_CONCEPT_LENGTH = 30;
const MAX_CONCEPT_LENGTH = 2000;

const PLATFORM_FILTERS = [
  { value: "", label: "Any", icon: ScanSearch },
  ...PLATFORM_OPTIONS.map((option) => ({
    ...option,
    icon:
      option.value === "pc"
        ? Monitor
        : option.value === "console"
          ? Tv
          : Smartphone,
  })),
] as const;

const GENRE_FILTERS = [
  { value: "", label: "Any" },
  ...GENRE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
] as const;

const SUBMIT_STATUS = [
  "Scanning comparable titles...",
  "Analyzing market signals...",
  "Building market context...",
] as const;

/**
 * Premium GameTech analysis console. Validation + demo routing unchanged.
 */
export function ConceptForm() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const conceptFieldId = useId();
  const platformGroupId = useId();
  const genreGroupId = useId();
  const [concept, setConcept] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = conceptFormSchema.safeParse({
      concept,
      platform: platform || undefined,
      genre: genre || undefined,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setStatusIndex(0);

    const timers = [
      window.setTimeout(() => setStatusIndex(1), 450),
      window.setTimeout(() => setStatusIndex(2), 900),
    ];

    window.setTimeout(() => {
      timers.forEach(clearTimeout);
      router.push("/analysis/demo");
    }, 1100);
  }

  const remaining = MAX_CONCEPT_LENGTH - concept.length;
  const meetsMinimum = concept.trim().length >= MIN_CONCEPT_LENGTH;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_50%_at_18%_30%,oklch(0.55_0.1_250_/_0.16),transparent_65%)]"
      />

      <Container>
        <Reveal className="mb-10 max-w-2xl sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-md border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent">
            <ScanSearch className="size-3.5" aria-hidden="true" />
            Market analysis console
          </div>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            Analyze your concept
          </h2>
          <p className="mt-3 max-w-[48ch] text-base text-pretty text-white/45">
            Drop a short brief. Optional filters sharpen comparable titles.
          </p>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.75fr)] lg:gap-14">
          <Reveal>
            <form
              id="analyze"
              onSubmit={handleSubmit}
              className="relative w-full scroll-mt-28"
              noValidate
            >
              <div className="rounded-xl border border-white/10 bg-[#0c1118]/92 p-5 panel-bevel sm:p-7">
                <div className="flex items-end justify-between gap-3">
                  <Label
                    htmlFor={conceptFieldId}
                    className="mb-0 text-[13px] text-white/70"
                  >
                    Describe your game concept
                  </Label>
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      remaining < 80 ? "text-opportunity" : "text-white/30",
                    )}
                    aria-live="polite"
                  >
                    {concept.length}/{MAX_CONCEPT_LENGTH}
                  </span>
                </div>

                <Textarea
                  id={conceptFieldId}
                  rows={6}
                  placeholder={CONCEPT_PLACEHOLDER}
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  minLength={MIN_CONCEPT_LENGTH}
                  maxLength={MAX_CONCEPT_LENGTH}
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error
                      ? `${conceptFieldId}-error`
                      : `${conceptFieldId}-hint`
                  }
                  className="mt-3 min-h-[160px] border-white/10 bg-black/35 text-[15px] leading-relaxed transition-[border-color,box-shadow] duration-300 focus-visible:border-accent/55 focus-visible:shadow-[0_0_0_3px_oklch(0.78_0.13_185_/_0.18)] focus-visible:ring-0"
                />
                <p
                  id={`${conceptFieldId}-hint`}
                  className="mt-2 text-[11px] text-white/30"
                >
                  Minimum {MIN_CONCEPT_LENGTH} characters for a useful scan.
                </p>

                <fieldset className="mt-7">
                  <legend
                    id={platformGroupId}
                    className="mb-2.5 text-[13px] font-medium text-white/70"
                  >
                    Platform
                  </legend>
                  <div
                    role="radiogroup"
                    aria-labelledby={platformGroupId}
                    className="flex flex-wrap gap-1.5 rounded-lg border border-white/[0.08] bg-black/25 p-1.5"
                  >
                    {PLATFORM_FILTERS.map((option) => {
                      const Icon = option.icon;
                      const selected = platform === option.value;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setPlatform(option.value)}
                          className={cn(
                            "inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm transition-[background-color,color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:flex-none",
                            selected
                              ? "border border-accent/35 bg-accent/15 text-accent shadow-[inset_0_1px_0_oklch(1_0_0_/_0.06)]"
                              : "border border-transparent text-white/50 hover:bg-white/[0.04] hover:text-white",
                          )}
                        >
                          <Icon className="size-3.5 opacity-80" aria-hidden="true" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-6">
                  <legend
                    id={genreGroupId}
                    className="mb-2.5 text-[13px] font-medium text-white/70"
                  >
                    Genre
                  </legend>
                  <div
                    role="radiogroup"
                    aria-labelledby={genreGroupId}
                    className="flex flex-wrap gap-2"
                  >
                    {GENRE_FILTERS.map((option) => {
                      const selected = genre === option.value;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setGenre(option.value)}
                          className={cn(
                            "rounded-md border px-3 py-1.5 text-sm transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]",
                            selected
                              ? "border-accent/40 bg-accent/15 text-accent"
                              : "border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/16 hover:text-white",
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    id={error ? `${conceptFieldId}-error` : undefined}
                    className="min-h-5 text-xs text-negative"
                    role={error ? "alert" : undefined}
                  >
                    {error}
                  </p>

                  <Magnetic strength={0.16}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !meetsMinimum}
                      aria-busy={isSubmitting}
                      className="glow-accent group relative min-w-[14.5rem] overflow-hidden"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      />
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={isSubmitting ? statusIndex : "idle"}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="relative inline-flex items-center gap-2"
                        >
                          <ScanSearch className="size-4" aria-hidden="true" />
                          {isSubmitting
                            ? SUBMIT_STATUS[statusIndex]
                            : "Analyze Market"}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.08} className="relative hidden min-h-[280px] lg:block">
            <p className="pointer-events-none select-none font-display text-[clamp(3.5rem,7vw,5.75rem)] leading-[0.9] font-bold tracking-[-0.04em] text-white/[0.06]">
              ANALYZE
            </p>
            <p className="relative z-10 mt-5 max-w-[28ch] text-sm leading-relaxed text-pretty text-white/40">
              Demo reports always resolve to a fixture-backed analysis so the pitch
              never depends on Steam staying up.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={VISUAL_ASSETS.analyzeGlow.path}
              alt=""
              className="pointer-events-none absolute right-0 bottom-0 w-[68%] opacity-65"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div
              aria-hidden="true"
              className="absolute right-6 bottom-10 size-36 rounded-full bg-[radial-gradient(circle,oklch(0.65_0.14_250_/_0.35),transparent_70%)] blur-2xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
