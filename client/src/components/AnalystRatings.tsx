import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { useAnalystRatings } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";
import type { AnalystRating } from "@/types";

const RATING_COLORS: Record<AnalystRating["rating"], { bg: string; text: string }> = {
  strong_buy: { bg: "bg-primary", text: "text-primary" },
  buy: { bg: "bg-primary/70", text: "text-primary" },
  hold: { bg: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  sell: { bg: "bg-destructive/70", text: "text-destructive" },
  strong_sell: { bg: "bg-destructive", text: "text-destructive" },
};

const RATING_SHORT: Record<AnalystRating["rating"], string> = {
  strong_buy: "Buy",
  buy: "Buy",
  hold: "Hold",
  sell: "Sell",
  strong_sell: "Sell",
};

export function AnalystRatings() {
  const { data: ratings, isLoading } = useAnalystRatings(6);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!ratings || ratings.length === 0) return null;

  const sortedRatings = [...ratings].sort((a, b) => b.rating_score - a.rating_score);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold sm:text-2xl">Analyst Ratings</h2>
        <span className="text-muted-foreground text-xs sm:text-sm">Consensus</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {sortedRatings.map((rating) => {
          const style = RATING_COLORS[rating.rating];
          const isPositive = rating.upside_percent > 0;

          return (
            <div
              key={rating.symbol}
              className="border-border bg-card rounded-(--radius) border p-3 sm:p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
                <div className="min-w-0">
                  <span className="font-mono text-sm font-semibold sm:text-base">
                    {rating.symbol}
                  </span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                    {rating.name}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`font-mono text-sm font-semibold sm:text-lg ${style.text}`}>
                    {RATING_SHORT[rating.rating]}
                  </span>
                  <span className="text-muted-foreground block text-[10px] sm:text-xs">
                    {rating.analyst_count} analysts
                  </span>
                </div>
              </div>

              <div className="mb-2 sm:mb-3">
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full sm:h-2">
                  <div
                    className={`h-full rounded-full transition-all ${style.bg}`}
                    style={{ width: `${(rating.rating_score / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Target</span>
                </div>
                <span className="font-mono">${rating.target_price}</span>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-xs sm:mt-2 sm:text-sm">
                <span className="text-muted-foreground">Upside</span>
                <div
                  className={`flex items-center gap-0.5 font-mono sm:gap-1 ${isPositive ? "text-primary" : "text-destructive"}`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  )}
                  {isPositive ? "+" : ""}
                  {rating.upside_percent.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
