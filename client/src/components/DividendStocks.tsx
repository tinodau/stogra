import { Banknote, Calendar } from "lucide-react";
import { useDividendStocks } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";

export function DividendStocks() {
  const { data: dividends, isLoading } = useDividendStocks(6);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!dividends || dividends.length === 0) return null;

  const sortedDividends = [...dividends].sort((a, b) => b.dividend_yield - a.dividend_yield);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Top Dividend Stocks</h2>
        <span className="text-muted-foreground text-sm">Highest yields</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedDividends.map((stock) => (
          <div key={stock.symbol} className="border-border bg-card rounded-(--radius) border p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <span className="font-mono font-semibold">{stock.symbol}</span>
                <span className="text-muted-foreground block text-xs">{stock.name}</span>
              </div>
              <div className="text-right">
                <span className="text-primary font-mono text-lg font-semibold">
                  {stock.dividend_yield.toFixed(2)}%
                </span>
                <span className="text-muted-foreground block text-xs">Yield</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5" />
                  <span>Annual</span>
                </div>
                <span className="font-mono">${stock.annual_dividend.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
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
