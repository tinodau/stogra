import { Plus, X } from "lucide-react";
import type { StockData } from "@/types";

interface StockListProps {
  stocks: StockData[];
  onAdd?: (symbol: string) => void;
  onRemove?: (symbol: string) => void;
}

export function StockList({ stocks, onAdd, onRemove }: StockListProps) {
  return (
    <div className="border-border overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="w-20 px-3 py-2 text-left font-medium">Ticker</th>
            <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">Company</th>
            <th className="px-3 py-2 text-right font-medium">Price</th>
            <th className="w-20 px-3 py-2 text-right font-medium">Change</th>
            <th className="w-10 px-2 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <tr key={stock.symbol} className="bg-card hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2">
                  <span className="font-mono font-semibold">{stock.symbol}</span>
                </td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span className="text-muted-foreground truncate">{stock.name}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-mono">${stock.price.toFixed(2)}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={`font-mono ${isPositive ? "text-primary" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}
                    {stock.change_percent.toFixed(2)}%
                  </span>
                </td>
                <td className="px-2 py-2 text-center">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
