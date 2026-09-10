"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

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
import { conceptFormSchema } from "@/lib/analysis/types";
import { VISUAL_ASSETS } from "@/lib/visual-assets";

const MIN_CONCEPT_LENGTH = 30;

/**
 * Primary conversion surface. Validation + demo routing unchanged.
 */
export function ConceptForm() {
  const router = useRouter();
  const conceptFieldId = useId();
  const [concept, setConcept] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    router.push("/analysis/demo");
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_50%_at_20%_40%,oklch(0.55_0.1_185_/_0.16),transparent_65%)]"
      />

      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-16">
          <Reveal>
            <form
              id="analyze"
              onSubmit={handleSubmit}
              className="relative w-full scroll-mt-28"
              noValidate
            >
              <div className="rounded-xl border border-white/10 bg-[#0c1118]/90 p-5 panel-bevel sm:p-7">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Analyze your concept
                    </h2>
                    <p className="mt-2 max-w-[40ch] text-sm text-white/45">
                      Drop a short brief. Optional filters sharpen comparable titles.
                    </p>
                  </div>
                </div>

                <Label htmlFor={conceptFieldId}>Describe your game concept</Label>
                <Textarea
                  id={conceptFieldId}
                  rows={5}
                  placeholder={CONCEPT_PLACEHOLDER}
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  minLength={MIN_CONCEPT_LENGTH}
                  required
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${conceptFieldId}-error` : undefined}
                  className="mt-2 border-white/10 bg-black/30"
                />

                <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-sm">
                  <div>
                    <Label htmlFor={`${conceptFieldId}-platform`}>Platform</Label>
                    <Select
                      id={`${conceptFieldId}-platform`}
                      value={platform}
                      onChange={(event) => setPlatform(event.target.value)}
                      className="border-white/10 bg-black/30"
                    >
                      <option value="">Any</option>
                      {PLATFORM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`${conceptFieldId}-genre`}>Genre</Label>
                    <Select
                      id={`${conceptFieldId}-genre`}
                      value={genre}
                      onChange={(event) => setGenre(event.target.value)}
                      className="border-white/10 bg-black/30"
                    >
                      <option value="">Any</option>
                      {GENRE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p
                    id={error ? `${conceptFieldId}-error` : undefined}
                    className="text-xs text-negative"
                    role={error ? "alert" : undefined}
                  >
                    {error}
                  </p>
                  <Magnetic strength={0.18}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="glow-accent shrink-0 group"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                      ) : (
                        <span className="flex size-7 items-center justify-center rounded-full bg-accent-foreground/12 transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </span>
                      )}
                      Analyze Market
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="relative hidden min-h-[320px] lg:block">
            <p className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] font-bold tracking-[-0.04em] text-white/[0.07]">
              ANALYZE
            </p>
            <p className="mt-6 max-w-[28ch] text-sm leading-relaxed text-white/40">
              Demo reports always resolve to a fixture-backed analysis so the pitch
              never depends on Steam staying up.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={VISUAL_ASSETS.analyzeGlow.path}
              alt=""
              className="pointer-events-none absolute -right-6 bottom-0 w-[70%] opacity-70"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <div
              aria-hidden="true"
              className="absolute right-4 bottom-8 size-40 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.12_185_/_0.35),transparent_70%)] blur-2xl"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
