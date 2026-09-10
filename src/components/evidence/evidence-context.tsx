"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { EvidenceDrawer } from "@/components/evidence/evidence-drawer";
import { getEvidenceForTheme } from "@/lib/analysis/scoring";
import type { EvidenceReview, ReviewTheme } from "@/lib/analysis/types";

interface EvidenceContextValue {
  openEvidence: (themeId: string) => void;
}

const EvidenceContext = createContext<EvidenceContextValue | null>(null);

/** Lets any theme/opportunity card open the shared evidence drawer by theme id. */
export function useEvidenceDrawer(): EvidenceContextValue {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error("useEvidenceDrawer must be used within an EvidenceProvider");
  }
  return context;
}

interface EvidenceProviderProps {
  themes: readonly ReviewTheme[];
  evidence: readonly EvidenceReview[];
  children: ReactNode;
}

/**
 * Owns which theme's evidence is currently open and renders the single
 * drawer instance for the whole report, so "View Evidence" buttons
 * scattered across Player Voice and Opportunities don't each need their
 * own drawer/state.
 */
export function EvidenceProvider({
  themes,
  evidence,
  children,
}: EvidenceProviderProps) {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const contextValue = useMemo<EvidenceContextValue>(
    () => ({
      openEvidence: (themeId: string) => {
        if (!themes.some((theme) => theme.id === themeId)) return;
        setActiveThemeId(themeId);
      },
    }),
    [themes],
  );

  const activeTheme = themes.find((theme) => theme.id === activeThemeId) ?? null;
  const activeEvidence = activeThemeId
    ? getEvidenceForTheme(evidence, activeThemeId)
    : [];

  return (
    <EvidenceContext.Provider value={contextValue}>
      {children}
      <EvidenceDrawer
        theme={activeTheme}
        evidence={activeEvidence}
        onClose={() => setActiveThemeId(null)}
      />
    </EvidenceContext.Provider>
  );
}
