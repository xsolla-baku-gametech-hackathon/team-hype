"use client";

import { useEvidenceDrawer } from "@/components/evidence/evidence-context";
import { Button, type ButtonProps } from "@/components/ui/button";

interface ViewEvidenceButtonProps extends Omit<ButtonProps, "onClick"> {
  themeId: string;
}

export function ViewEvidenceButton({ themeId, ...props }: ViewEvidenceButtonProps) {
  const { openEvidence } = useEvidenceDrawer();

  return (
    <Button
      aria-haspopup="dialog"
      onClick={() => openEvidence(themeId)}
      {...props}
    >
      View Evidence
    </Button>
  );
}
