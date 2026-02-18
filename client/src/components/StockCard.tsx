import type { StockData } from "@/types";
import { SparklineView } from "./SparklineView";

interface StockCardProps {
  stock: StockData;
  onRemove?: () => void;
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="group border-border bg-card relative rounded-[var(--radius)] border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-mono text-base font-semibold tracking-tight sm:text-lg">
              {stock.symbol}
            </h3>
            <span className="text-muted-foreground truncate text-sm">{stock.name}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xl font-medium tabular-nums sm:text-2xl">
              ${stock.price.toFixed(2)}
            </span>
            <span
              className={`font-mono text-sm font-medium tabular-nums ${
                isPositive ? "text-primary" : "text-destructive"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
              {stock.change_percent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="h-12 w-24 shrink-0 sm:h-14 sm:w-32">
          <SparklineView data={stock.sparkline} isPositive={isPositive} height={48} />
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Remove ${stock.symbol}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
