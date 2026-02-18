import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { useAnalystRatings } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";
import type { AnalystRating } from "@/types";

const RATING_COLORS: Record<AnalystRating["rating"], { bg: string; text: string; width: number }> =
  {
    strong_buy: { bg: "bg-primary", text: "text-primary", width: 100 },
    buy: { bg: "bg-primary/70", text: "text-primary", width: 75 },
    hold: { bg: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", width: 50 },
    sell: { bg: "bg-destructive/70", text: "text-destructive", width: 25 },
    strong_sell: { bg: "bg-destructive", text: "text-destructive", width: 10 },
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
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!ratings || ratings.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Analyst Ratings</h2>
        <span className="text-muted-foreground text-sm">Consensus</span>
      </div>

      <div className="space-y-4">
        {ratings.map((rating) => {
          const style = RATING_COLORS[rating.rating];
          const isPositive = rating.upside_percent > 0;

          return (
            <div
              key={rating.symbol}
              className="border-border bg-card rounded-(--radius) border p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{rating.symbol}</span>
                  <span className="text-muted-foreground text-sm">{rating.name}</span>
                </div>
                <span className={`text-sm font-medium ${style.text}`}>
                  {RATING_LABELS[rating.rating]}
                </span>
              </div>

              <div className="mb-3">
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${style.bg}`}
                    style={{ width: `${(rating.rating_score / 5) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Sell</span>
                  <span className="text-muted-foreground">Hold</span>
                  <span className="text-muted-foreground">Buy</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Target className="text-muted-foreground h-4 w-4" />
                    <span className="font-mono">${rating.target_price}</span>
                  </div>
                  <span className="text-muted-foreground">{rating.analyst_count} analysts</span>
                </div>
                <div
                  className={`flex items-center gap-1 font-mono ${isPositive ? "text-primary" : "text-destructive"}`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
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
