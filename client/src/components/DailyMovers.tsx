import { useMarketSnapshot } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function DailyMovers() {
  const { data: snapshot, isLoading } = useMarketSnapshot();

  return (
    <div className="border-border bg-card rounded-[var(--radius)] border p-4">
      <h3 className="mb-4 font-serif text-lg font-semibold">Daily Movers</h3>

      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonSidebarItem key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {snapshot?.top_movers.map((stock) => {
            const isPositive = stock.change_percent >= 0;

            return (
              <div
                key={stock.symbol}
                className="hover:bg-muted/50 -mx-2 flex items-center justify-between rounded-md px-2 py-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-semibold ${
                      isPositive ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {stock.symbol}
                  </span>
                  <span className="text-muted-foreground max-w-[100px] truncate text-xs">
                    {stock.name}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono text-sm font-medium ${
                      isPositive ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.change_percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
