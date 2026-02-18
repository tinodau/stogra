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

const RATING_LABELS: Record<AnalystRating["rating"], string> = {
  strong_buy: "Strong Buy",
  buy: "Buy",
  hold: "Hold",
  sell: "Sell",
  strong_sell: "Strong Sell",
};

export function AnalystRatings() {
  const { data: ratings, isLoading } = useAnalystRatings(6);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!ratings || ratings.length === 0) return null;

  const sortedRatings = [...ratings].sort((a, b) => b.rating_score - a.rating_score);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Analyst Ratings</h2>
        <span className="text-muted-foreground text-sm">Consensus</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedRatings.map((rating) => {
          const style = RATING_COLORS[rating.rating];
          const isPositive = rating.upside_percent > 0;

          return (
            <div
              key={rating.symbol}
              className="border-border bg-card rounded-(--radius) border p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span className="font-mono font-semibold">{rating.symbol}</span>
                  <span className="text-muted-foreground block text-xs">{rating.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-lg font-semibold ${style.text}`}>
                    {RATING_LABELS[rating.rating]}
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    {rating.analyst_count} analysts
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${style.bg}`}
                    style={{ width: `${(rating.rating_score / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  <span>Target</span>
                </div>
                <span className="font-mono">${rating.target_price}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upside</span>
                <div
                  className={`flex items-center gap-1 font-mono ${isPositive ? "text-primary" : "text-destructive"}`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
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
