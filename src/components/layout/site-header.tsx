"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Magnetic } from "@/components/shared/magnetic";
import { Button } from "@/components/ui/button";
import { APP_NAME, DEMO_ANALYSIS_PATH, PRIMARY_NAV } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

/**
 * Interactive HUD dock — cursor spotlight, magnetic links, sliding
 * active pill. Transparent over the hero, densifies on scroll.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hash, setHash] = useState("");
  const dockRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  // Close the mobile menu when the route changes (render-time sync —
  // avoids setState-in-effect cascading render warnings).
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setOpen(false);
  }

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, oklch(0.78 0.13 185 / 0.12), transparent 55%)`;

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      const firstLink =
        mobileNavRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
    });

    function getFocusable(): HTMLElement[] {
      const nodes: HTMLElement[] = [];
      if (menuButtonRef.current) nodes.push(menuButtonRef.current);
      mobileNavRef.current
        ?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
        .forEach((node) => nodes.push(node));
      return nodes;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onDockMove(event: MouseEvent<HTMLDivElement>) {
    if (reduce || !dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    spotX.set(event.clientX - rect.left);
    spotY.set(event.clientY - rect.top);
  }

  const activeHref =
    pathname.startsWith("/analysis")
      ? DEMO_ANALYSIS_PATH
      : pathname === "/" && hash
        ? (PRIMARY_NAV.find((item) => item.href === `/${hash}`)?.href ?? null)
        : null;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 print:hidden">
      <div className="mx-auto max-w-[1280px] px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6">
        <motion.div
          ref={dockRef}
          onMouseMove={onDockMove}
          initial={reduce ? false : { opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto relative flex h-[3.4rem] items-center justify-between gap-3 rounded-2xl border px-3 transition-[background,box-shadow,border-color] duration-500 sm:h-14 sm:px-4",
            scrolled
              // backdrop-blur only kicks in once scrolled — at the top of
              // the page (hero, busiest frame) the header stays cheap
              // (solid-ish tint, no live backdrop resampling every frame).
              ? "border-white/12 bg-[#07090d]/92 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.95),inset_0_1px_0_oklch(1_0_0_/_0.06)] backdrop-blur-2xl"
              : "border-white/[0.08] bg-[#07090d]/55 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.05)]",
          )}
        >
          {/* Decorative clip layer — keeps washes inside the dock without
              clipping :focus-visible rings on interactive controls. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          >
            {!reduce ? (
              <motion.div
                className="absolute inset-0 opacity-80"
                style={{ background: spotlight }}
              />
            ) : null}
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </div>

          <div className="relative z-10 flex min-w-0 items-center">
            <Link
              href="/"
              aria-label={`${APP_NAME} home`}
              className="group inline-flex min-w-0 items-center"
            >
              <Logo className="transition-[letter-spacing,opacity] duration-500 group-hover:tracking-[-0.02em] group-hover:opacity-90" />
            </Link>
          </div>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            <div className="relative flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] p-1">
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  item.href === DEMO_ANALYSIS_PATH
                    ? pathname.startsWith("/analysis")
                    : activeHref === item.href;
                const isHot = hovered === item.href || isActive;

                return (
                  <Magnetic key={item.href} strength={0.18}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHovered(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative z-10 rounded-full px-3.5 py-1.5 text-[13px] tracking-wide transition-colors duration-300",
                        isHot ? "text-white" : "text-white/45 hover:text-white/80",
                      )}
                    >
                      {isHot ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06)]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      ) : null}
                      {item.label}
                    </Link>
                  </Magnetic>
                );
              })}
            </div>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-white/50 hover:bg-white/[0.05] hover:text-white sm:inline-flex"
            >
              <Link href={DEMO_ANALYSIS_PATH}>View Demo</Link>
            </Button>

            <Magnetic strength={0.24}>
              <Button
                asChild
                size="sm"
                className="glow-accent relative overflow-hidden"
              >
                <Link
                  href="/#analyze"
                  className="group inline-flex items-center gap-2"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
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
              ref={menuButtonRef}
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-colors hover:border-accent/30 hover:bg-white/[0.04] hover:text-white md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {open ? (
            <motion.div
              ref={mobileNavRef}
              id="mobile-nav"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#07090d]/95 p-2.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col gap-0.5">
                {PRIMARY_NAV.map((item, index) => {
                  const isActive =
                    item.href === DEMO_ANALYSIS_PATH
                      ? pathname.startsWith("/analysis")
                      : activeHref === item.href;

                  return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3.5 py-3 text-sm transition-colors",
                        isActive
                          ? "bg-white/[0.06] text-white"
                          : "text-white/70 hover:bg-white/[0.04] hover:text-white",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                  );
                })}
                <Link
                  href="/#analyze"
                  className="mt-1 block rounded-xl bg-accent px-3.5 py-3 text-center text-sm font-medium text-accent-foreground"
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
