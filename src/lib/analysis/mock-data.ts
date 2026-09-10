import { deriveMarketLandscape } from "@/lib/analysis/scoring";
import type {
  AnalysisReport,
  ComparableGame,
  EvidenceReview,
  MarketOpportunity,
  ReviewTheme,
} from "@/lib/analysis/types";

/**
 * Demo fixture for the co-op survival train concept used throughout the
 * pitch. Game metadata (appid, review counts, positive ratio, price) is
 * sourced from each title's real Steam store page, so the demo reads as
 * authentic even though similarity scores, themes, and opportunities are
 * illustrative. Review quotes are written for this demo — not scraped —
 * and are clearly confined to this fixture rather than the app's data
 * model, which is shaped to hold real Steam reviews unchanged.
 *
 * Frozen to a fixed reference year so the derived market-landscape stats
 * (e.g. "recent releases") don't silently drift as real time passes.
 */
const DEMO_REFERENCE_YEAR = 2026;

const COMPARABLE_GAMES: readonly ComparableGame[] = [
  {
    appId: 1159690,
    name: "Voidtrain",
    similarity: 0.87,
    totalReviews: 4_800,
    positiveRatio: 0.72,
    genres: ["Survival", "Co-op", "Crafting"],
    releaseYear: 2025,
    price: "$29.99",
  },
  {
    appId: 648800,
    name: "Raft",
    similarity: 0.81,
    totalReviews: 190_000,
    positiveRatio: 0.97,
    genres: ["Survival", "Crafting", "Co-op"],
    releaseYear: 2022,
    price: "$19.99",
  },
  {
    appId: 951440,
    name: "Volcanoids",
    similarity: 0.78,
    totalReviews: 9_240,
    positiveRatio: 0.83,
    genres: ["Survival", "Base-Building", "Co-op"],
    releaseYear: 2019,
    price: "$19.99",
  },
  {
    appId: 1641960,
    name: "Forever Skies",
    similarity: 0.74,
    totalReviews: 4_920,
    positiveRatio: 0.78,
    genres: ["Survival", "Exploration", "Co-op"],
    releaseYear: 2025,
    price: "$29.99",
  },
  {
    appId: 602960,
    name: "Barotrauma",
    similarity: 0.69,
    totalReviews: 88_400,
    positiveRatio: 0.94,
    genres: ["Co-op", "Survival Horror", "Simulation"],
    releaseYear: 2023,
    price: "$34.99",
  },
  {
    appId: 1149460,
    name: "Icarus",
    similarity: 0.64,
    totalReviews: 30_600,
    positiveRatio: 0.77,
    genres: ["Survival", "PvE", "Co-op"],
    releaseYear: 2021,
    price: "$34.99",
  },
  {
    appId: 962130,
    name: "Grounded",
    similarity: 0.58,
    totalReviews: 40_900,
    positiveRatio: 0.92,
    genres: ["Survival", "Adventure", "Co-op"],
    releaseYear: 2022,
    price: "$39.99",
  },
  {
    appId: 892970,
    name: "Valheim",
    similarity: 0.52,
    totalReviews: 533_900,
    positiveRatio: 0.94,
    genres: ["Survival", "Adventure", "Co-op"],
    releaseYear: 2021,
    price: "$29.99",
  },
];

/** Individual reviews sampled and mined by the (mock) analysis pipeline. */
const REVIEWS_ANALYZED_COUNT = 2_846;

// reviewCount = round(percentage * REVIEWS_ANALYZED_COUNT) — themes
// overlap (one review can surface multiple themes), so these
// intentionally don't sum to the total.
const THEMES: readonly ReviewTheme[] = [
  {
    id: "co-op-exploration",
    sentiment: "positive",
    label: "Co-op exploration",
    percentage: 31,
    reviewCount: 882,
    gamesFoundIn: 7,
    gamesTotal: 8,
    confidence: "high",
  },
  {
    id: "atmosphere",
    sentiment: "positive",
    label: "Atmosphere",
    percentage: 24,
    reviewCount: 683,
    gamesFoundIn: 6,
    gamesTotal: 8,
    confidence: "high",
  },
  {
    id: "base-progression",
    sentiment: "positive",
    label: "Base progression",
    percentage: 22,
    reviewCount: 626,
    gamesFoundIn: 6,
    gamesTotal: 8,
    confidence: "high",
  },
  {
    id: "emergent-moments",
    sentiment: "positive",
    label: "Emergent moments",
    percentage: 18,
    reviewCount: 512,
    gamesFoundIn: 5,
    gamesTotal: 8,
    confidence: "medium",
  },
  {
    id: "repetitive-endgame",
    sentiment: "complaint",
    label: "Repetitive endgame",
    percentage: 38,
    reviewCount: 1_081,
    gamesFoundIn: 6,
    gamesTotal: 8,
    confidence: "high",
  },
  {
    id: "weak-coop-progression",
    sentiment: "complaint",
    label: "Weak co-op progression",
    percentage: 27,
    reviewCount: 768,
    gamesFoundIn: 4,
    gamesTotal: 8,
    confidence: "medium",
  },
  {
    id: "inventory-friction",
    sentiment: "complaint",
    label: "Inventory friction",
    percentage: 22,
    reviewCount: 626,
    gamesFoundIn: 5,
    gamesTotal: 8,
    confidence: "medium",
  },
  {
    id: "content-shortage",
    sentiment: "complaint",
    label: "Content shortage",
    percentage: 18,
    reviewCount: 512,
    gamesFoundIn: 4,
    gamesTotal: 8,
    confidence: "medium",
  },
];

const OPPORTUNITIES: readonly MarketOpportunity[] = [
  {
    id: "shared-coop-progression",
    rank: 1,
    title: "Shared Co-op Progression",
    confidence: "high",
    gamesFoundIn: 4,
    gamesTotal: 8,
    evidenceReviewCount: 47,
    whyItMatters:
      "Players consistently enjoy cooperative exploration but complain when meaningful progression only belongs to the host.",
    opportunity:
      "Make persistent progression shared across party members.",
    recommendation:
      "Treat shared progression as a core system rather than an optional multiplayer convenience.",
    relatedThemeId: "weak-coop-progression",
  },
  {
    id: "midgame-content-curve",
    rank: 2,
    title: "Smooth the Midgame Content Curve",
    confidence: "high",
    gamesFoundIn: 6,
    gamesTotal: 8,
    evidenceReviewCount: 52,
    whyItMatters:
      "Players enjoy the first playthrough but consistently describe the endgame loop as repetitive once core systems are unlocked.",
    opportunity:
      "Introduce late-game modifiers, escalating threats, or narrative beats that keep the core loop evolving after progression caps out.",
    recommendation:
      "Treat endgame pacing as a first-class design problem, not a byproduct of the crafting tree running out of content.",
    relatedThemeId: "repetitive-endgame",
  },
  {
    id: "streamlined-inventory",
    rank: 3,
    title: "Streamline Inventory & Logistics",
    confidence: "medium",
    gamesFoundIn: 5,
    gamesTotal: 8,
    evidenceReviewCount: 34,
    whyItMatters:
      "Inventory and resource-transfer friction is one of the most consistently cited quality-of-life complaints, especially in co-op sessions.",
    opportunity:
      "Reduce manual item shuffling with smarter stacking, shared storage, and quick-transfer actions between players and vehicles.",
    recommendation:
      "Budget inventory UX as a core system early — it compounds every other complaint once co-op sessions scale past two players.",
    relatedThemeId: "inventory-friction",
  },
  {
    id: "post-launch-cadence",
    rank: 4,
    title: "Commit to a Post-Launch Content Cadence",
    confidence: "medium",
    gamesFoundIn: 4,
    gamesTotal: 8,
    evidenceReviewCount: 29,
    whyItMatters:
      "Players who finish the available content often go quiet rather than complain — reviews describe running out of things to do rather than active dissatisfaction.",
    opportunity:
      "Plan biome, boss, or region drops on a visible cadence so long-term players have a reason to return between major updates.",
    recommendation:
      "Communicate a content roadmap publicly; perceived momentum retains players even between content drops.",
    relatedThemeId: "content-shortage",
  },
  {
    id: "emergent-coop-moments",
    rank: 5,
    title: "Double Down on Emergent Co-op Moments",
    confidence: "medium",
    gamesFoundIn: 5,
    gamesTotal: 8,
    evidenceReviewCount: 26,
    whyItMatters:
      "Unscripted emergent moments — a collapsing base, a chaotic escape — are the most consistently praised co-op experiences across comparable games.",
    opportunity:
      "Design systems that produce emergent failure and recovery moments deliberately, rather than treating them as accidental byproducts of simulation.",
    recommendation:
      "Prioritize systemic interactions (physics, AI, environment) over scripted set-pieces when co-op moments are the desired takeaway.",
    relatedThemeId: "emergent-moments",
  },
];

const EVIDENCE: readonly EvidenceReview[] = [
  // Weak co-op progression — appears in 4 games, backing opportunity #1.
  {
    id: "ev-voidtrain-1",
    gameName: "Voidtrain",
    sentiment: "negative",
    playtimeHours: 83,
    reviewText:
      "Fun with a group at first, but only the host actually keeps upgrades tied to the train's core systems. My friend joined halfway through and felt like a passenger instead of a crew member.",
    helpfulVotes: 22,
    steamPurchase: true,
    themeId: "weak-coop-progression",
  },
  {
    id: "ev-barotrauma-1",
    gameName: "Barotrauma",
    sentiment: "negative",
    playtimeHours: 146,
    reviewText:
      "Great chaos with a full crew, but new players joining a save with a leveled sub never really catch up on skills. It ends up being one or two people carrying every run.",
    helpfulVotes: 31,
    steamPurchase: true,
    themeId: "weak-coop-progression",
  },
  {
    id: "ev-icarus-1",
    gameName: "Icarus",
    sentiment: "negative",
    playtimeHours: 61,
    reviewText:
      "Missions are great with friends, but only the session host keeps their outpost progress. Everyone else is basically starting from scratch every drop.",
    helpfulVotes: 14,
    steamPurchase: true,
    themeId: "weak-coop-progression",
  },
  {
    id: "ev-foreverskies-1",
    gameName: "Forever Skies",
    sentiment: "negative",
    playtimeHours: 37,
    reviewText:
      "Co-op is fun for a weekend but the airship upgrades belong to whoever hosts. My friends stopped joining once they realized their materials weren't really 'theirs'.",
    helpfulVotes: 9,
    steamPurchase: false,
    themeId: "weak-coop-progression",
  },

  // Repetitive endgame
  {
    id: "ev-volcanoids-1",
    gameName: "Volcanoids",
    sentiment: "negative",
    playtimeHours: 52,
    reviewText:
      "First 20 hours are great. Once the drill is fully upgraded there isn't much left to do except repeat the same eruption cycle.",
    helpfulVotes: 18,
    steamPurchase: true,
    themeId: "repetitive-endgame",
  },
  {
    id: "ev-grounded-1",
    gameName: "Grounded",
    sentiment: "negative",
    playtimeHours: 74,
    reviewText:
      "Loved it through the main story. After the last boss the loop just resets to grinding the same yard with nothing new to chase.",
    helpfulVotes: 27,
    steamPurchase: true,
    themeId: "repetitive-endgame",
  },
  {
    id: "ev-raft-1",
    gameName: "Raft",
    sentiment: "negative",
    playtimeHours: 40,
    reviewText:
      "Once you reach the final story islands the loop is basically done. There's not much reason to keep sailing after that.",
    helpfulVotes: 12,
    steamPurchase: true,
    themeId: "repetitive-endgame",
  },

  // Inventory friction
  {
    id: "ev-barotrauma-2",
    gameName: "Barotrauma",
    sentiment: "negative",
    playtimeHours: 210,
    reviewText:
      "Moving cargo between lockers during an emergency is more stressful than the monsters. The inventory UI needs a serious pass.",
    helpfulVotes: 40,
    steamPurchase: true,
    themeId: "inventory-friction",
  },
  {
    id: "ev-icarus-2",
    gameName: "Icarus",
    sentiment: "negative",
    playtimeHours: 88,
    reviewText:
      "Constant menu-diving to manage stacks between backpack, workshop and exotics storage. It breaks the pacing of every drop.",
    helpfulVotes: 16,
    steamPurchase: true,
    themeId: "inventory-friction",
  },
  {
    id: "ev-voidtrain-2",
    gameName: "Voidtrain",
    sentiment: "negative",
    playtimeHours: 45,
    reviewText:
      "Sorting the train's storage wagons manually every stop gets old fast. A simple auto-sort or shared stash would fix most of my complaints.",
    helpfulVotes: 8,
    steamPurchase: false,
    themeId: "inventory-friction",
  },

  // Content shortage
  {
    id: "ev-foreverskies-2",
    gameName: "Forever Skies",
    sentiment: "negative",
    playtimeHours: 29,
    reviewText:
      "Beautiful game but I finished everything available in a weekend. Hoping updates add more biomes before I lose interest.",
    helpfulVotes: 11,
    steamPurchase: true,
    themeId: "content-shortage",
  },
  {
    id: "ev-grounded-2",
    gameName: "Grounded",
    sentiment: "negative",
    playtimeHours: 55,
    reviewText:
      "Really polished for what's there, just wish there was more yard to explore after the story ends.",
    helpfulVotes: 13,
    steamPurchase: true,
    themeId: "content-shortage",
  },

  // Co-op exploration (positive)
  {
    id: "ev-raft-2",
    gameName: "Raft",
    sentiment: "positive",
    playtimeHours: 68,
    reviewText:
      "Exploring new islands with friends and figuring out the next story beat together is the best part of this game by far.",
    helpfulVotes: 35,
    steamPurchase: true,
    themeId: "co-op-exploration",
  },
  {
    id: "ev-valheim-1",
    gameName: "Valheim",
    sentiment: "positive",
    playtimeHours: 190,
    reviewText:
      "Sailing into a biome you've never seen with three friends and no idea what's waiting is still incredible after 190 hours.",
    helpfulVotes: 52,
    steamPurchase: true,
    themeId: "co-op-exploration",
  },
  {
    id: "ev-barotrauma-3",
    gameName: "Barotrauma",
    sentiment: "positive",
    playtimeHours: 120,
    reviewText:
      "Nothing beats the panic of the whole crew scrambling when the sub starts flooding mid-mission. Genuinely great co-op tension.",
    helpfulVotes: 29,
    steamPurchase: true,
    themeId: "co-op-exploration",
  },

  // Atmosphere (positive)
  {
    id: "ev-foreverskies-3",
    gameName: "Forever Skies",
    sentiment: "positive",
    playtimeHours: 33,
    reviewText:
      "The sound design on the airship and the dust storms rolling over the ruins below is unbelievably atmospheric.",
    helpfulVotes: 19,
    steamPurchase: true,
    themeId: "atmosphere",
  },
  {
    id: "ev-icarus-3",
    gameName: "Icarus",
    sentiment: "positive",
    playtimeHours: 102,
    reviewText:
      "Watching a storm roll in over the mountains while you're scrambling back to the drop pod never stops being tense and beautiful.",
    helpfulVotes: 24,
    steamPurchase: true,
    themeId: "atmosphere",
  },
];

export const DEMO_ANALYSIS_REPORT: AnalysisReport = {
  id: "demo",
  concept:
    "A cooperative survival game where players manage a moving train, gather resources during stops, and upgrade the train together.",
  platform: "pc",
  genre: "survival",
  createdAt: "2026-09-10T18:00:00.000Z",
  summary: {
    comparableGamesCount: COMPARABLE_GAMES.length,
    reviewsAnalyzedCount: REVIEWS_ANALYZED_COUNT,
    recurringThemesDetected: 17,
    marketOpportunitiesCount: OPPORTUNITIES.length,
  },
  executiveSummary:
    "Your concept sits in a validated co-op survival space with strong demand for exploration and progression. The clearest recurring pain across comparable games is weak shared progression. Main opportunity: design multiplayer progress so every party member retains meaningful advancement.",
  comparableGames: COMPARABLE_GAMES,
  themes: THEMES,
  opportunities: OPPORTUNITIES,
  evidence: EVIDENCE,
  marketLandscape: deriveMarketLandscape(COMPARABLE_GAMES, DEMO_REFERENCE_YEAR),
};
