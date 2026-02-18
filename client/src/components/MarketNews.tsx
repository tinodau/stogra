import { ExternalLink } from "lucide-react";
import { useNews } from "@/hooks/useMarketData";
import { SkeletonCard } from "./SkeletonCard";

function formatPublishedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function MarketNews() {
  const { data: news, isLoading } = useNews(6);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold sm:text-xl">Market News</h2>
        <span className="text-muted-foreground text-xs sm:text-sm">Latest updates</span>
      </div>

      <div className="space-y-2">
        {news.map((item) => (
          <a
            key={`${item.publisher}-${item.published_at}`}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-card hover:border-muted-foreground/30 flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors sm:px-4"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground text-sm leading-snug font-medium">{item.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">{item.publisher}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatPublishedAt(item.published_at)}
                </span>
                {item.related_stocks.length > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex gap-1">
                      {item.related_stocks.slice(0, 2).map((symbol) => (
                        <span
                          key={symbol}
                          className="bg-muted rounded px-1.5 py-0.5 font-mono text-[10px] font-medium"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <ExternalLink className="text-muted-foreground h-4 w-4 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
