"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide Lenis smooth scrolling, driven by GSAP's ticker instead of a
 * second requestAnimationFrame loop. This is the key perf/smoothness fix:
 * - One shared raf clock for Lenis + every GSAP ScrollTrigger scrub
 *   (pipeline-strip, etc.), so they never drift out of sync/jank.
 * - `gsap.ticker.lagSmoothing(0)` stops GSAP from "catching up" with
 *   jumpy multi-frame skips after a tab stall, which otherwise reads as
 *   a stutter in the middle of a smooth scroll.
 * - Lenis pauses entirely on hidden tabs so it isn't burning frames in
 *   the background.
 * Respects prefers-reduced-motion (falls back to native scroll).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function update(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    function onVisibilityChange() {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname) return;

      const hash = url.hash;
      if (!hash || hash === "#") return;

      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      if (!id) return;

      const el = document.getElementById(id);
      if (!(el instanceof HTMLElement)) return;

      event.preventDefault();
      window.history.pushState(null, "", hash);
      lenis.scrollTo(el, {
        offset: -88,
        onComplete: () => {
          if (!el.hasAttribute("tabindex")) {
            el.setAttribute("tabindex", "-1");
          }
          el.focus({ preventScroll: true });
        },
      });
    }

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
