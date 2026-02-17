import { useTopMarketCap } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function TopMarketCap() {
  const { data: stocks, isLoading } = useTopMarketCap(10);

  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-4">
      <h3 className="mb-4 font-serif text-lg font-semibold">Top Market Cap</h3>
      
      {isLoading ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonSidebarItem key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {stocks?.map((stock, index) => {
            const marketCapB = stock.market_cap
              ? (stock.market_cap / 1_000_000_000).toFixed(0)
              : "N/A";
            
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between py-2 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-mono font-semibold">
                      {stock.symbol}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm block">
                    ${stock.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {marketCapB}B
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
