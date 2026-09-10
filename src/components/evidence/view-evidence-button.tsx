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
      {...props}
      aria-haspopup="dialog"
      onClick={() => openEvidence(themeId)}
    >
      View Evidence
    </Button>
  );
}
