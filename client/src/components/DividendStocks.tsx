import { Banknote, Calendar } from "lucide-react";
import { useDividendStocks } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";

export function DividendStocks() {
  const { data: dividends, isLoading } = useDividendStocks(6);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!dividends || dividends.length === 0) return null;

  const sortedDividends = [...dividends].sort((a, b) => b.dividend_yield - a.dividend_yield);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold sm:text-2xl">Top Dividend Stocks</h2>
        <span className="text-muted-foreground text-xs sm:text-sm">Highest yields</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {sortedDividends.map((stock) => (
          <div
            key={stock.symbol}
            className="border-border bg-card rounded-(--radius) border p-3 sm:p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
              <div className="min-w-0">
                <span className="font-mono text-sm font-semibold sm:text-base">{stock.symbol}</span>
                <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                  {stock.name}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-primary font-mono text-base font-semibold sm:text-lg">
                  {stock.dividend_yield.toFixed(2)}%
                </span>
                <span className="text-muted-foreground block text-[10px] sm:text-xs">Yield</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Banknote className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Annual</span>
                </div>
                <span className="font-mono">${stock.annual_dividend.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Ex-Div</span>
                </div>
                <span className="font-mono text-xs">{stock.ex_dividend_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-mono">${stock.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frequency</span>
                <span className="capitalize">{stock.payout_frequency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
