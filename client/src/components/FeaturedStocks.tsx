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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="font-serif text-lg font-semibold sm:text-xl">Trending Today</h2>
        <SectorFilterComponent activeSector={activeSector} onSectorChange={setActiveSector} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {stocks.slice(0, 6).map((stock) => {
          const isPositive = stock.change >= 0;

          return (
            <div
              key={stock.symbol}
              className="border-border bg-card group hover:border-muted-foreground/30 flex items-center justify-between gap-2 rounded-md border px-3 py-2 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-mono text-sm font-semibold">{stock.symbol}</h3>
                  <span className="text-muted-foreground hidden truncate text-xs sm:inline">
                    {stock.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-medium">${stock.price.toFixed(2)}</span>
                  <span
                    className={`font-mono text-xs ${isPositive ? "text-primary" : "text-destructive"}`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.change_percent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAdd(stock.symbol)}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded p-1 transition-colors"
                aria-label={`Add ${stock.symbol}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
