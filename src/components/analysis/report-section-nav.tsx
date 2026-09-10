"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ExportReportButton } from "@/components/analysis/export-report-button";
import { cn } from "@/lib/utils/cn";

interface ReportSectionLink {
  readonly id: string;
  readonly label: string;
}

const SECTION_LINKS: readonly ReportSectionLink[] = [
  { id: "overview", label: "Overview" },
  { id: "competitors", label: "Competitors" },
  { id: "player-voice", label: "Player Voice" },
  { id: "opportunities", label: "Opportunities" },
  { id: "evidence", label: "Evidence" },
];

export function ReportSectionNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const sections = SECTION_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Report sections"
      className="scrollbar-none sticky top-16 z-30 -mx-5 flex min-w-0 items-center justify-between gap-4 overflow-x-auto rounded-xl border border-white/[0.07] bg-[#0a0c10]/85 px-4 py-2.5 text-sm text-muted-foreground backdrop-blur-xl print:hidden sm:-mx-8 sm:px-5"
    >
      <div className="flex min-w-0 gap-1">
        {SECTION_LINKS.map((link) => (
          <Link
            key={link.id}
            href={`#${link.id}`}
            aria-current={active === link.id ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 transition-colors duration-300",
              active === link.id
                ? "bg-accent/15 text-accent"
                : "hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ExportReportButton />
    </nav>
  );
}
