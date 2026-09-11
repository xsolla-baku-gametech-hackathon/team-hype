"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Monitor, ScanSearch, Smartphone, Tv } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useMotionTemplate,
} from "motion/react";

import { Reveal } from "@/components/shared/reveal";
import { Magnetic } from "@/components/shared/magnetic";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CONCEPT_PLACEHOLDER,
  GENRE_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/lib/analysis/constants";
import {
  MAX_CONCEPT_LENGTH,
  MIN_CONCEPT_LENGTH,
  conceptFormSchema,
} from "@/lib/analysis/types";
import { VISUAL_ASSETS } from "@/lib/visual-assets";
import { PENDING_CONCEPT_STORAGE_KEY } from "@/lib/analysis/pending-concept";
import { DEMO_ANALYSIS_PATH } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

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
 * Immersive analysis console — transparent glass form over a full-bleed
 * animated holo-panel stage (transparent PNG).
 */
export function ConceptForm() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const conceptFieldId = useId();
  const genreGroupId = useId();
  const [concept, setConcept] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const submitTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      submitTimersRef.current.forEach((id) => window.clearTimeout(id));
      submitTimersRef.current = [];
    };
  }, []);

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

    submitTimersRef.current.forEach((id) => window.clearTimeout(id));
    submitTimersRef.current = [
      window.setTimeout(() => setStatusIndex(1), 450),
      window.setTimeout(() => setStatusIndex(2), 900),
      window.setTimeout(() => {
        submitTimersRef.current = [];
        try {
          sessionStorage.setItem(
            PENDING_CONCEPT_STORAGE_KEY,
            result.data.concept,
          );
        } catch {
          // Private mode / quota — report still loads with fixture concept.
        }
        const params = new URLSearchParams();
        if (result.data.platform) params.set("platform", result.data.platform);
        if (result.data.genre) params.set("genre", result.data.genre);
        const query = params.toString();
        router.push(
          query ? `${DEMO_ANALYSIS_PATH}?${query}` : DEMO_ANALYSIS_PATH,
        );
      }, 1100),
    ];
  }

  const trimmedLength = concept.trim().length;
  const remaining = MAX_CONCEPT_LENGTH - concept.length;
  const meetsMinimum = trimmedLength >= MIN_CONCEPT_LENGTH;

  return (
    <section
      id="analyze-section"
      className="relative isolate min-h-[100dvh] overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28"
    >
      <AnalyzeStage />

      <Container className="relative z-20">
        <Reveal className="mb-10 max-w-2xl sm:mb-12">
          {/* Section index — editorial strip, not a second header pill */}
          <div className="mb-5 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.22em] text-white/35 uppercase">
              04
            </span>
            <span
              aria-hidden="true"
              className="h-px w-8 bg-gradient-to-r from-accent/70 to-transparent"
            />
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/45 uppercase">
              Market console
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            Analyze your concept
          </h2>
          <p className="mt-3 max-w-[48ch] text-base text-pretty text-white/50">
            Drop a short brief. Optional filters sharpen comparable titles.
          </p>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-12">
          <Reveal>
            <form
              id="analyze"
              tabIndex={-1}
              onSubmit={handleSubmit}
              className="relative w-full scroll-mt-28 outline-none"
              noValidate
            >
              <div className="rounded-2xl border border-white/12 bg-[#0a0e14]/45 p-4 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08),0_32px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-7">
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
                  >
                    {trimmedLength}/{MAX_CONCEPT_LENGTH}
                  </span>
                </div>

                <Textarea
                  id={conceptFieldId}
                  name="concept"
                  autoComplete="off"
                  rows={6}
                  placeholder={CONCEPT_PLACEHOLDER}
                  value={concept}
                  onChange={(event) => {
                    setConcept(event.target.value);
                    if (error) setError(null);
                  }}
                  minLength={MIN_CONCEPT_LENGTH}
                  maxLength={MAX_CONCEPT_LENGTH}
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error
                      ? `${conceptFieldId}-error`
                      : `${conceptFieldId}-hint`
                  }
                  className="mt-3 min-h-[160px] border-white/10 bg-black/25 text-[15px] leading-relaxed backdrop-blur-sm transition-[border-color,box-shadow] duration-300 focus-visible:border-accent/55 focus-visible:shadow-[0_0_0_3px_oklch(0.78_0.13_185_/_0.18)] focus-visible:ring-0"
                />
                <p
                  id={`${conceptFieldId}-hint`}
                  className="mt-2 text-[11px] text-white/55"
                >
                  Minimum {MIN_CONCEPT_LENGTH} characters for a useful scan.
                </p>

                <fieldset className="mt-7">
                  <legend className="mb-2.5 text-[13px] font-medium text-white/70">
                    Platform
                  </legend>
                  <div
                    role="radiogroup"
                    className="flex flex-wrap gap-1.5 rounded-lg border border-white/[0.08] bg-black/20 p-1.5 backdrop-blur-sm"
                    onKeyDown={(event) => {
                      const keys = [
                        "ArrowRight",
                        "ArrowDown",
                        "ArrowLeft",
                        "ArrowUp",
                        "Home",
                        "End",
                      ];
                      if (!keys.includes(event.key)) return;

                      event.preventDefault();
                      const currentIndex = PLATFORM_FILTERS.findIndex(
                        (option) => option.value === platform,
                      );
                      let nextIndex = currentIndex < 0 ? 0 : currentIndex;

                      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        nextIndex = (currentIndex + 1) % PLATFORM_FILTERS.length;
                      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        nextIndex =
                          (currentIndex - 1 + PLATFORM_FILTERS.length) %
                          PLATFORM_FILTERS.length;
                      } else if (event.key === "Home") {
                        nextIndex = 0;
                      } else if (event.key === "End") {
                        nextIndex = PLATFORM_FILTERS.length - 1;
                      }

                      setPlatform(PLATFORM_FILTERS[nextIndex].value);
                      if (error) setError(null);
                      const radios =
                        event.currentTarget.querySelectorAll<HTMLElement>(
                          '[role="radio"]',
                        );
                      radios[nextIndex]?.focus();
                    }}
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
                          tabIndex={selected ? 0 : -1}
                          onClick={() => {
                            setPlatform(option.value);
                            if (error) setError(null);
                          }}
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

                <div className="mt-6">
                  <Label htmlFor={genreGroupId} className="text-[13px] text-white/70">
                    Genre
                  </Label>
                  <Select
                    id={genreGroupId}
                    name="genre"
                    autoComplete="off"
                    value={genre}
                    onChange={(event) => {
                      setGenre(event.target.value);
                      if (error) setError(null);
                    }}
                    className="mt-2.5 border-white/[0.08] bg-black/20 text-white/85 backdrop-blur-sm focus-visible:border-accent/55 focus-visible:shadow-[0_0_0_3px_oklch(0.78_0.13_185_/_0.18)] focus-visible:ring-0"
                  >
                    {GENRE_FILTERS.map((option) => (
                      <option
                        key={option.label}
                        value={option.value}
                        className="bg-[#0c1118] text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

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

          {/* Spacer column — visual stage paints behind/through this area */}
          <div className="pointer-events-none relative hidden min-h-[420px] lg:block xl:min-h-[520px]">
            <p className="relative z-10 max-w-[28ch] text-sm leading-relaxed text-pretty text-white/40">
              Demo reports always resolve to a fixture-backed analysis so the pitch
              never depends on Steam staying up.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Full-bleed transparent holo stage. The float/glow/beam/watermark
 * loops are CSS keyframes (`.analyze-*` in globals.css) so they run on
 * the compositor thread instead of a permanently-mounted GSAP context —
 * this section mounts on initial page load even off-screen, so it used
 * to keep 4 rAF tweens running the whole time, competing with scroll.
 * Only the mouse parallax stays JS-driven (event-based, cheap when idle).
 */
function AnalyzeStage() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 22 });
  const sy = useSpring(my, { stiffness: 70, damping: 22 });
  const panelTransform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    mx.set(px * 24);
    my.set(py * 16);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden lg:pointer-events-auto"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_72%_48%,oklch(0.42_0.1_280_/_0.28),transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_18%_40%,oklch(0.45_0.08_230_/_0.14),transparent_60%)]" />
      <div className="absolute inset-0 hud-grid opacity-40 [mask-image:radial-gradient(ellipse_75%_70%_at_70%_50%,#000_15%,transparent_78%)]" />

      <p className="analyze-watermark pointer-events-none absolute top-[18%] right-[2%] select-none font-display text-[clamp(5rem,16vw,12rem)] leading-none font-bold tracking-[-0.05em] text-white/[0.07] lg:right-[4%]">
        ANALYZE
      </p>

      <div className="analyze-beam absolute top-[46%] right-0 hidden h-px w-[70%] bg-gradient-to-r from-transparent via-accent/45 to-transparent lg:block" />

      <div className="analyze-glow absolute top-[28%] right-[8%] h-[48%] w-[48%] rounded-full bg-[radial-gradient(circle,oklch(0.58_0.14_260_/_0.35),transparent_68%)] blur-3xl" />

      {/* Dominant transparent holo panel */}
      <motion.div
        className="absolute top-1/2 right-[-4%] w-[min(92vw,720px)] -translate-y-1/2 sm:right-[-2%] sm:w-[min(78vw,780px)] lg:right-[0%] lg:w-[min(58vw,860px)] xl:w-[min(52vw,920px)]"
        style={reduce ? undefined : { transform: panelTransform }}
      >
        <div className="analyze-panel will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={VISUAL_ASSETS.analyzeGlow.path}
            alt=""
            loading="lazy"
            decoding="async"
            width={1024}
            height={1024}
            className="w-full scale-[1.1] object-contain opacity-90 drop-shadow-[0_0_80px_oklch(0.55_0.14_260_/_0.45)] sm:scale-[1.15]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      </motion.div>

      {/* Secondary smaller shard for depth */}
      <div className="shard-float absolute bottom-[12%] right-[38%] hidden w-[18%] opacity-50 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={VISUAL_ASSETS.supportHexShard.path}
          alt=""
          loading="lazy"
          decoding="async"
          width={512}
          height={512}
          className="w-full object-contain"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-background via-background/60 to-transparent lg:w-[22%]" />
    </div>
  );
}
