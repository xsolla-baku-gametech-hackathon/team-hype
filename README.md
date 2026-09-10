# GameLens

**Know what players want before you build it.**

GameLens turns a game concept into evidence-backed market intelligence. A
developer describes what they're building; GameLens finds semantically
comparable Steam titles, mines their player reviews for recurring
positive/complaint themes, and surfaces ranked, evidence-linked market
opportunities — so decisions are grounded in what real players already say,
not guesswork.

Built for the **Xsolla Baku GameTech Hackathon** (Sept 9–11).

## How it works

1. **Describe your concept** — a short description plus optional
   platform/genre filters.
2. **Comparable games are found** — titles closest to the concept by
   similarity.
3. **Player reviews are mined** — recurring themes are extracted and split
   into what players love vs. complain about, each with a confidence level
   and a review-count/coverage footprint.
4. **Opportunities are synthesized** — ranked, evidence-backed
   recommendations, each traceable back to the theme (and sample reviews)
   it came from.
5. **The report is exportable** — a fixed-layout PDF via the browser's
   native print, so results survive the meeting.

## Tech stack

- **Next.js 16** (App Router, Turbopack, Server Components by default)
- **TypeScript**, strict mode, no `any`
- **Tailwind CSS v4** — dark-only design tokens, no light theme for this MVP
- **Zod** — input validation and Steam response schemas
- **Vitest** — unit tests for the pieces most likely to break silently
  (Steam response normalization, dedup, scoring/aggregation, formatting)
- Hand-built `shadcn/ui`-style primitives (`class-variance-authority` +
  `@radix-ui/react-slot`, `@radix-ui/react-dialog` for the evidence drawer)
  — no CLI-generated runtime dependency

No separate backend, no database, no auth. Steam access goes through a
single Next.js Route Handler.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — sensible defaults are baked in
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The concept form always
routes to **`/analysis/demo`** — a fully worked, fixture-backed report that
renders identically whether or not Steam is reachable. This is deliberate:
a live pitch can't depend on a third-party API staying up.

Other useful scripts:

```bash
npm run lint    # ESLint (next/core-web-vitals + TypeScript)
npm test        # Vitest
npm run build   # Production build + type-check
```

## Steam integration

`GET /api/steam/reviews/[appid]` proxies Steam's public
[`appreviews`](https://partner.steamgames.com/doc/store/getreviews) endpoint
(`store.steampowered.com/appreviews/{appid}`), normalizing and
deduplicating raw responses server-side. Errors are returned as a
predictable shape —

```json
{ "error": { "code": "STEAM_TIMEOUT", "message": "..." } }
```

— mapped to correct HTTP status codes (`400` invalid input, `502` upstream
failure, `504` timeout). Notably, Steam's `weighted_vote_score` field is
serialized inconsistently (sometimes a string, sometimes a number) —
the schema in `lib/steam/types.ts` accepts both, found and fixed via live
testing against the real API rather than assumptions.

The analysis report itself currently runs entirely on realistic mock data
(`lib/analysis/mock-data.ts`, real games/appids like Voidtrain, Raft,
Volcanoids) — the Steam client exists and is fully tested/working
end-to-end, but isn't yet wired into the report pipeline. See
[Roadmap](#roadmap).

## Project structure

```
src/
  app/                    Routes (App Router) + the Steam route handler
  components/
    landing/              Concept form, hero, workflow visual
    analysis/             Report shell, progress, sections, PDF export
    games/                Comparable-game cards
    insights/             Review theme cards/columns
    opportunities/        Opportunity cards/list
    evidence/             Evidence drawer + provider
    layout/, shared/, ui/  App shell, primitives (Button, Badge, Sheet, ...)
  lib/
    analysis/              Domain types, mock fixtures, scoring/derivation
    steam/                 Typed Steam client, schemas, normalization
    http/                  Shared API error shape
    utils/                 cn(), number/percentage formatting
  types/                   (shared cross-cutting types, where applicable)
```

Derived statistics (market landscape, theme groupings, evidence-per-theme)
are always computed from source arrays in `lib/analysis/scoring.ts` rather
than duplicated by hand, so the UI can't drift out of sync with its own
data.

## Hackathon scope

This is an MVP built in staged increments over the hackathon window. It
intentionally does **not** include: a live semantic-search/embedding
pipeline, LLM-generated theme synthesis, persistence/database, auth, or
payments. The domain model (`AnalysisReport` and friends) is shaped the way
a real pipeline's output would look, specifically so mock data can be
swapped for a live one without touching any component below the report
page.

## Roadmap

- Wire live Steam reviews into the evidence drawer for comparable games,
  falling back to mock evidence if Steam is unavailable mid-demo
- Replace the mock similarity/theme-mining pipeline with a real
  embeddings + LLM synthesis step
- Persist analyses behind a real per-submission id (currently only
  `/analysis/demo` resolves)

---

<details>
<summary>Hackathon submission info</summary>

Xsolla Baku GameTech Hackathon — judging categories: Best Project, Best
Idea, Best Code, Most GitHub Commits. See
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines.

</details>
