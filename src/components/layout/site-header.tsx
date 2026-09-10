"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";
import { PRIMARY_NAV } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

/**
 * Floating command island nav — detached from the top edge, cinematic entry.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 12);
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 print:hidden">
      <div className="mx-auto max-w-[1320px] px-4 pt-3 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative flex h-14 items-center justify-between gap-4 rounded-xl border px-3.5 transition-[background,box-shadow,border-color] duration-500 sm:h-[3.75rem] sm:px-5",
            scrolled
              ? "border-white/10 bg-[#0a0c10]/82 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border-white/[0.07] bg-[#0a0c10]/55 backdrop-blur-md",
          )}
        >
          <Link href="/" aria-label="GameLens home" className="inline-flex min-w-0">
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                item.href === "/analysis/demo"
                  ? pathname.startsWith("/analysis")
                  : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-[13px] tracking-wide text-white/45 transition-colors duration-300 hover:text-white",
                    active && "bg-white/[0.04] text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-white/55 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
            >
              <Link href="/analysis/demo">View Demo</Link>
            </Button>
            <Magnetic strength={0.22}>
              <Button asChild size="sm" className="glow-accent">
                <Link href="/#analyze" className="group inline-flex items-center gap-2">
                  Analyze Market
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent-foreground/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <span aria-hidden="true" className="text-[11px] leading-none">
                      →
                    </span>
                  </span>
                </Link>
              </Button>
            </Magnetic>

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 text-white/70 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0c10]/95 p-3 backdrop-blur-xl md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {PRIMARY_NAV.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href="/#analyze"
                  className="mt-1 block rounded-md bg-accent px-3 py-2.5 text-center text-sm font-medium text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  Analyze Market
                </Link>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
