"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

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

const MIN_CONCEPT_LENGTH = 30;

/**
 * The primary conversion surface of the landing page. Validates locally
 * with the same Zod schema the API route will eventually use, so client
 * and server stay in sync as the mock pipeline is replaced with a real
 * one.
 *
 * For this MVP stage, submission always routes to the pre-built demo
 * report (`/analysis/demo`) — a real per-submission analysis id will
 * replace this once the analysis route handler exists.
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
    // The progress screen at /analysis/[id] owns its own simulated
    // staging animation, so we navigate immediately rather than
    // duplicating a loading state here.
    router.push("/analysis/demo");
  }

  return (
    <form
      id="analyze"
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl scroll-mt-24"
      noValidate
    >
      <div
        aria-hidden="true"
        className="absolute -inset-x-8 -inset-y-8 -z-10 rounded-[2rem] bg-accent/12 blur-3xl"
      />

      <div className="rounded-2xl border border-white/[0.1] bg-[#0c0c12]/90 p-5 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-6">
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
        />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-xs">
          <div>
            <Label htmlFor={`${conceptFieldId}-platform`}>Platform</Label>
            <Select
              id={`${conceptFieldId}-platform`}
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
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

        <div className="mt-5 flex items-center justify-between gap-4">
          <p
            id={error ? `${conceptFieldId}-error` : undefined}
            className="text-xs text-negative"
            role={error ? "alert" : undefined}
          >
            {error}
          </p>
          <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
            {isSubmitting ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
            Analyze Market
          </Button>
        </div>
      </div>
    </form>
  );
}
