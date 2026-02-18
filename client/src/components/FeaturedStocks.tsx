import { useState } from "react";
import { Plus } from "lucide-react";
import type { StockData, SectorFilter } from "@/types";
import { SparklineView } from "./SparklineView";
import { SectorFilter as SectorFilterComponent } from "./SectorFilter";

interface FeaturedStocksProps {
  stocks: StockData[];
  onAdd: (symbol: string) => void;
}

export function FeaturedStocks({ stocks, onAdd }: FeaturedStocksProps) {
  const [activeSector, setActiveSector] = useState<SectorFilter>("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-2xl font-semibold">Trending Today</h2>
        <SectorFilterComponent activeSector={activeSector} onSectorChange={setActiveSector} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stocks.slice(0, 6).map((stock) => {
          const isPositive = stock.change >= 0;

          return (
            <div
              key={stock.symbol}
              className="border-border bg-card group rounded-(--radius) border p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-mono font-semibold">{stock.symbol}</h3>
                    <span className="text-muted-foreground truncate text-xs">{stock.name}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-lg font-medium">${stock.price.toFixed(2)}</span>
                    <span
                      className={`font-mono text-sm ${isPositive ? "text-primary" : "text-destructive"}`}
                    >
                      {isPositive ? "+" : ""}
                      {stock.change_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="ml-2 w-20">
                  <SparklineView data={stock.sparkline} isPositive={isPositive} height={32} />
                </div>
              </div>

              <button
                onClick={() => onAdd(stock.symbol)}
                className="border-border bg-background hover:bg-muted mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add to Watchlist
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
