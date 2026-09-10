import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Lightbulb,
  MessageSquareQuote,
  ScanSearch,
  Sparkles,
} from "lucide-react";

export type ShowcaseAccent = "accent" | "positive" | "negative" | "opportunity";

export interface ShowcaseSignal {
  readonly label: string;
  readonly tone: ShowcaseAccent;
}

export interface ShowcaseSlideData {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly accent: ShowcaseAccent;
  readonly signals: readonly ShowcaseSignal[];
  readonly preview: {
    readonly eyebrow: string;
    readonly body: string;
    readonly meta: string;
  };
}

export const SHOWCASE_SLIDES: readonly ShowcaseSlideData[] = [
  {
    id: "idea",
    step: "01",
    title: "Game Idea Input",
    description: "Describe the concept. GameLens turns intent into a searchable market brief.",
    icon: Lightbulb,
    accent: "accent",
    signals: [
      { label: "Concept captured", tone: "accent" },
      { label: "Genre inferred", tone: "accent" },
    ],
    preview: {
      eyebrow: "Your brief",
      body: "A co-op survival craft loop on a drifting asteroid — short sessions, base building, hostile fauna.",
      meta: "Ready to scan Steam",
    },
  },
  {
    id: "similar",
    step: "02",
    title: "Similar Games Discovery",
    description: "Surface the closest Steam titles by play pattern — not just keyword match.",
    icon: ScanSearch,
    accent: "accent",
    signals: [
      { label: "Voidtrain · 92%", tone: "accent" },
      { label: "Raft · 88%", tone: "accent" },
      { label: "Volcanoids · 81%", tone: "accent" },
    ],
    preview: {
      eyebrow: "Comparable set",
      body: "Three high-signal comps ranked by session length, co-op demand, and craft depth.",
      meta: "Semantic proximity",
    },
  },
  {
    id: "signals",
    step: "03",
    title: "Player Review Signals",
    description: "Mine real reviews for recurring love and friction — with evidence attached.",
    icon: MessageSquareQuote,
    accent: "positive",
    signals: [
      { label: "Love · base progression", tone: "positive" },
      { label: "Pain · mid-game grind", tone: "negative" },
    ],
    preview: {
      eyebrow: "Theme clusters",
      body: "Players reward readable progression. They punish opaque resource sinks after hour ten.",
      meta: "1.2k reviews sampled",
    },
  },
  {
    id: "opportunities",
    step: "04",
    title: "Market Opportunities",
    description: "Rank gaps where demand is loud and current titles leave space.",
    icon: Compass,
    accent: "opportunity",
    signals: [
      { label: "Gap · short-session co-op", tone: "opportunity" },
      { label: "Whitespace · readable loops", tone: "accent" },
    ],
    preview: {
      eyebrow: "Opportunity card",
      body: "Ship a 45-minute run that still feels like base ownership — underserved vs. long-haul survival.",
      meta: "Priority · High",
    },
  },
  {
    id: "recommendations",
    step: "05",
    title: "Evidence-backed Recommendations",
    description: "Leave with a decision memo you can defend in the pitch room.",
    icon: Sparkles,
    accent: "accent",
    signals: [
      { label: "Build with confidence", tone: "accent" },
      { label: "Traceable evidence", tone: "accent" },
    ],
    preview: {
      eyebrow: "Decision memo",
      body: "Prioritize co-op session design and transparent progression. Defer deep grind systems.",
      meta: "Linked to source reviews",
    },
  },
];

export const TRUST_SIGNALS = [
  "Steam market intelligence",
  "Real player signals",
  "Evidence-backed insights",
] as const;
