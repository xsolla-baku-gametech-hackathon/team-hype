"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV } from "@/lib/site-config";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic sticky header: logo arrives from the left, nav/actions from
 * the right, with a quiet glass surface over the dark hero.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 print:hidden">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#07070b]/65 px-4 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:h-16 sm:px-5"
        >
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="min-w-0"
          >
            <Link href="/" aria-label="GameLens home" className="inline-flex">
              <Logo />
            </Link>
          </motion.div>

          <motion.nav
            aria-label="Primary"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm text-white/45 md:flex"
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="tracking-wide transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-white/60 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
            >
              <Link href="/analysis/demo">View Demo</Link>
            </Button>
            <Button asChild size="sm" className="shadow-[0_0_24px_-6px_oklch(0.64_0.19_275_/_0.5)]">
              <Link href="/#analyze">Analyze Market</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
