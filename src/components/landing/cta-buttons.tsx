import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CTAButtonsProps {
  className?: string;
}

/**
 * Primary conversion cluster for the hero — demo for the pitch path,
 * analyze for the product path.
 */
export function CTAButtons({ className }: CTAButtonsProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" size="lg" className="border-white/12 bg-white/[0.03] backdrop-blur-sm">
          <Link href="/analysis/demo">
            <Play aria-hidden="true" />
            View Demo
          </Link>
        </Button>
        <Button asChild size="lg" className="shadow-[0_0_32px_-8px_oklch(0.64_0.19_275_/_0.55)]">
          <Link href="/#analyze">
            Analyze Market
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
