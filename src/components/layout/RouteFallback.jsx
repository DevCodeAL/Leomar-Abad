/**
 * Shown while a lazily-loaded route chunk arrives. This is the one genuinely
 * asynchronous moment in the app — post content itself is bundled at build
 * time, so there is nothing else to wait for.
 *
 * Skeleton rather than a spinner: it reserves roughly the space the listing
 * will occupy, so the layout does not jump when the chunk lands.
 */
export function RouteFallback() {
  return (
    <div className="py-14 sm:py-20" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-elevated" />
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-elevated" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-elevated" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-2xl border border-line bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
