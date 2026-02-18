export function SkeletonCard() {
  return (
    <div className="border-border bg-card rounded-[var(--radius)] border p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-5 w-16 animate-pulse rounded" />
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          </div>
          <div className="flex items-baseline gap-3">
            <div className="bg-muted h-8 w-24 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          </div>
        </div>
        <div className="bg-muted ml-4 h-10 w-24 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function SkeletonSidebarItem() {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted h-4 w-12 animate-pulse rounded" />
        <div className="bg-muted h-3 w-24 animate-pulse rounded" />
      </div>
      <div className="bg-muted h-4 w-16 animate-pulse rounded" />
    </div>
  );
}
