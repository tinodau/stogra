import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNews } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";
import type { NewsItem } from "@/types";

function NewsSentimentIcon({ sentiment }: { sentiment: NewsItem["sentiment"] }) {
  if (sentiment === "positive") {
    return <TrendingUp className="text-primary h-4 w-4" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="text-destructive h-4 w-4" />;
  }
  return <Minus className="text-muted-foreground h-4 w-4" />;
}

function CategoryBadge({ category }: { category: NewsItem["category"] }) {
  const colors: Record<NewsItem["category"], string> = {
    earnings: "bg-primary/10 text-primary",
    market: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    company: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    economy: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${colors[category]}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

export function MarketNews() {
  const { data: news, isLoading } = useNews(6);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold sm:text-2xl">Market News</h2>
        <span className="text-muted-foreground text-xs sm:text-sm">Latest updates</span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {news.map((item) => (
          <article
            key={item.id}
            className="border-border bg-card hover:border-muted-foreground/20 rounded-(--radius) border p-3 transition-colors sm:p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <CategoryBadge category={item.category} />
                <NewsSentimentIcon sentiment={item.sentiment} />
              </div>
              <h3 className="text-foreground text-sm leading-snug font-medium sm:text-base">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs sm:text-sm">
                {item.summary}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:mt-3 sm:gap-3">
                <span className="text-muted-foreground">{item.source}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{item.published_at}</span>
                {item.related_stocks.length > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex gap-1">
                      {item.related_stocks.map((symbol) => (
                        <span
                          key={symbol}
                          className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs font-medium"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
