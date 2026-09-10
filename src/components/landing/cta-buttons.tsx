import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";

interface CTAButtonsProps {
  className?: string;
}

export function CTAButtons({ className }: CTAButtonsProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <Magnetic strength={0.2}>
          <Button asChild size="lg" className="glow-accent group">
            <Link href="/#analyze" className="inline-flex items-center gap-2">
              Analyze Market
              <span className="flex size-7 items-center justify-center rounded-full bg-accent-foreground/12 transition-transform duration-300 group-hover:translate-x-0.5 group-active:scale-95">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </Button>
        </Magnetic>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          <Link href="/analysis/demo">
            <Play aria-hidden="true" />
            View Demo
          </Link>
        </Button>
      </div>
    </div>
  );
}
