"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, Loader2, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ExportStatus = "idle" | "preparing" | "success" | "error";

/**
 * Premium print/PDF control. Still uses browser `window.print()` + the
 * existing print token theme — no backend contract changes.
 */
export function ExportReportButton() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<ExportStatus>("idle");
  const busyRef = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  const finishSuccess = useCallback(() => {
    if (!busyRef.current) return;
    busyRef.current = false;
    if (fallbackTimer.current) {
      clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    setStatus("success");
    resetTimer.current = setTimeout(() => {
      setStatus("idle");
    }, 2200);
  }, []);

  useEffect(() => {
    function onAfterPrint() {
      finishSuccess();
    }

    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("afterprint", onAfterPrint);
      clearTimers();
    };
  }, [clearTimers, finishSuccess]);

  function handleExport() {
    if (busyRef.current) return;

    busyRef.current = true;
    clearTimers();
    setStatus("preparing");

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      try {
        window.print();
        // Fallback when afterprint is unreliable (some WebKit builds).
        fallbackTimer.current = setTimeout(() => {
          finishSuccess();
        }, 900);
      } catch {
        setStatus("error");
        busyRef.current = false;
        resetTimer.current = setTimeout(() => setStatus("idle"), 2800);
      }
    });
  }

  const label =
    status === "preparing"
      ? "Preparing PDF"
      : status === "success"
        ? "Ready to save"
        : status === "error"
          ? "Export failed"
          : "Export PDF";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={status === "preparing"}
      aria-busy={status === "preparing"}
      aria-live="polite"
      onClick={handleExport}
      className={cn(
        "group relative min-w-[8.75rem] overflow-hidden border-white/12 bg-white/[0.03] transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        status === "idle" &&
          "hover:border-accent/35 hover:bg-accent/10 hover:shadow-[0_0_24px_-12px_var(--accent-glow)]",
        status === "preparing" && "border-accent/30 bg-accent/10 text-accent",
        status === "success" && "border-positive/35 bg-positive/10 text-positive",
        status === "error" && "border-negative/35 bg-negative/10 text-negative",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2"
        >
          {status === "preparing" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : status === "success" ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : status === "error" ? (
            <TriangleAlert className="size-3.5" aria-hidden="true" />
          ) : (
            <Download
              className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          )}
          {label}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
