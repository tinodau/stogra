import { useEarnings } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function EarningsMini() {
  const { data: earnings, isLoading } = useEarnings(5);

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-(--radius) border p-4">
        <h3 className="mb-4 font-serif text-lg font-semibold">Upcoming Earnings</h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSidebarItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!earnings || earnings.length === 0) return null;

  return (
    <div className="border-border bg-card rounded-(--radius) border p-4">
      <h3 className="mb-4 font-serif text-lg font-semibold">Upcoming Earnings</h3>
      <div className="space-y-3">
        {earnings.map((earning, index) => (
          <div
            key={`${earning.symbol}-${index}`}
            className="hover:bg-muted/50 -mx-2 flex items-center justify-between rounded-md px-2 py-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{earning.symbol}</span>
              <span className="text-muted-foreground text-xs">{earning.date}</span>
            </div>
            <span
              className={`rounded px-1.5 py-0.5 text-xs ${
                earning.time === "before_market"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : earning.time === "after_market"
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {earning.time === "before_market"
                ? "Pre"
                : earning.time === "after_market"
                  ? "Aft"
                  : "Day"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
