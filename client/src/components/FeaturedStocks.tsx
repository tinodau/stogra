import { useState } from "react";
import { Plus } from "lucide-react";
import type { StockData, SectorFilter } from "@/types";
import { SectorFilter as SectorFilterComponent } from "./SectorFilter";

interface FeaturedStocksProps {
  stocks: StockData[];
  onAdd: (symbol: string) => void;
}

export function FeaturedStocks({ stocks, onAdd }: FeaturedStocksProps) {
  const [activeSector, setActiveSector] = useState<SectorFilter>("all");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="font-serif text-xl font-semibold sm:text-2xl">Trending Today</h2>
        <SectorFilterComponent activeSector={activeSector} onSectorChange={setActiveSector} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {stocks.slice(0, 6).map((stock) => {
          const isPositive = stock.change >= 0;

          return (
            <div
              key={stock.symbol}
              className="border-border bg-card group rounded-(--radius) border p-3 transition-all hover:shadow-md sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-mono text-sm font-semibold sm:text-base">{stock.symbol}</h3>
                    <span className="text-muted-foreground truncate text-xs">{stock.name}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-base font-medium sm:text-lg">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span
                      className={`font-mono text-xs sm:text-sm ${isPositive ? "text-primary" : "text-destructive"}`}
                    >
                      {isPositive ? "+" : ""}
                      {stock.change_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAdd(stock.symbol)}
                className="border-border bg-background hover:bg-muted mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add to Watchlist</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
