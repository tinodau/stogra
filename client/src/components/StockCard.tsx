import type { StockData } from "@/types";

interface StockCardProps {
  stock: StockData;
  onRemove?: () => void;
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="group border-border bg-card flex items-center justify-between gap-2 rounded-md border px-3 py-2 sm:px-4 sm:py-2.5">
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="font-mono text-sm font-semibold sm:text-base">{stock.symbol}</h3>
        <span className="text-muted-foreground hidden truncate text-sm sm:inline">
          {stock.name}
        </span>
      </div>

      <div className="flex items-baseline gap-2 sm:gap-3">
        <span className="font-mono text-sm font-medium tabular-nums sm:text-base">
          ${stock.price.toFixed(2)}
        </span>
        <span
          className={`font-mono text-xs font-medium tabular-nums sm:text-sm ${
            isPositive ? "text-primary" : "text-destructive"
          }`}
        >
          {isPositive ? "+" : ""}
          {stock.change_percent.toFixed(2)}%
        </span>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground ml-1 rounded p-0.5 text-lg leading-none opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Remove ${stock.symbol}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
