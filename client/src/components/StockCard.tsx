import type { StockData } from "@/types";
import { SparklineView } from "./SparklineView";

interface StockCardProps {
  stock: StockData;
  onRemove?: () => void;
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="group relative rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-mono text-lg font-semibold tracking-tight">
              {stock.symbol}
            </h3>
            <span className="truncate text-sm text-muted-foreground">
              {stock.name}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-2xl font-medium tabular-nums">
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

        <div className="ml-4 w-24">
          <SparklineView
            data={stock.sparkline}
            isPositive={isPositive}
            height={40}
          />
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground"
            aria-label={`Remove ${stock.symbol}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
