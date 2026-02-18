import { Plus, X } from "lucide-react";
import type { StockData } from "@/types";

interface StockListProps {
  stocks: StockData[];
  onAdd?: (symbol: string) => void;
  onRemove?: (symbol: string) => void;
}

function StockLogo({ symbol }: { symbol: string }) {
  const colors: Record<string, string> = {
    NVDA: "bg-green-500",
    AAPL: "bg-gray-600",
    MSFT: "bg-blue-500",
    GOOGL: "bg-red-500",
    AMZN: "bg-orange-500",
    META: "bg-blue-600",
    TSLA: "bg-red-600",
    AMD: "bg-red-500",
    JPM: "bg-blue-700",
    JNJ: "bg-blue-400",
  };

  const bgColor = colors[symbol] || "bg-muted-foreground";
  const display = symbol.slice(0, 2);

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${bgColor}`}
    >
      {display}
    </div>
  );
}

export function StockList({ stocks, onAdd, onRemove }: StockListProps) {
  return (
    <div className="border-border divide-border divide-y overflow-hidden rounded-md border">
      {stocks.map((stock) => {
        const isPositive = stock.change >= 0;

        return (
          <div
            key={stock.symbol}
            className="bg-card hover:bg-muted/30 flex items-center gap-2 px-3 py-2.5 transition-colors sm:gap-3 sm:px-4"
          >
            <div className="w-8 shrink-0">
              <StockLogo symbol={stock.symbol} />
            </div>

            <div className="w-14 shrink-0 sm:w-16">
              <span className="font-mono text-sm font-semibold">{stock.symbol}</span>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-muted-foreground block truncate text-xs sm:text-sm">
                {stock.name}
              </span>
            </div>

            <div className="w-20 shrink-0 text-right sm:w-24">
              <span className="font-mono text-sm font-medium">${stock.price.toFixed(2)}</span>
            </div>

            <div className="w-16 shrink-0 text-right sm:w-20">
              <span
                className={`font-mono text-xs font-medium sm:text-sm ${isPositive ? "text-primary" : "text-destructive"}`}
              >
                {isPositive ? "+" : ""}
                {stock.change_percent.toFixed(2)}%
              </span>
            </div>

            <div className="w-8 shrink-0">
              {onRemove && (
                <button
                  onClick={() => onRemove(stock.symbol)}
                  className="text-muted-foreground hover:text-foreground rounded p-1"
                  aria-label={`Remove ${stock.symbol}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {onAdd && (
                <button
                  onClick={() => onAdd(stock.symbol)}
                  className="text-muted-foreground hover:text-primary rounded p-1"
                  aria-label={`Add ${stock.symbol}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
