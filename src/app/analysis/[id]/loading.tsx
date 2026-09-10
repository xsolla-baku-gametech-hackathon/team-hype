export default function AnalysisLoading() {
  return (
    <div
      className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center gap-3 px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
      <div className="h-8 w-full max-w-xl animate-pulse rounded bg-white/10" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
      <p className="sr-only">Loading analysis report…</p>
    </div>
  );
}
