import { useWatchlist } from "@/hooks/useWatchlist";
import { useStocks, useMarketSnapshot } from "@/hooks/useMarketData";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StockCard } from "@/components/StockCard";
import { TopMarketCap } from "@/components/TopMarketCap";
import { DailyMovers } from "@/components/DailyMovers";
import { SkeletonCard, SkeletonSidebarItem } from "@/components/SkeletonCard";

function App() {
  const { watchlist, remove, add } = useWatchlist();
  const { data: watchlistData, isLoading } = useStocks(watchlist);
  const { data: snapshot, isLoading: snapshotLoading } = useMarketSnapshot();

  return (
    <div className="bg-background min-h-screen font-sans antialiased">
      <Navbar />

      {/* Hero Section */}
      <HeroSection onAddStock={add} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left Column - Watchlist */}
          <main>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">Watchlist</h2>
              {watchlist.length > 0 && (
                <span className="text-muted-foreground text-sm">{watchlist.length} stocks</span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : watchlistData && watchlistData.length > 0 ? (
              <div className="space-y-4">
                {watchlistData.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onRemove={() => remove(stock.symbol)}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border bg-card rounded-[var(--radius)] border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  Your watchlist is empty. Use the search above to add stocks.
                </p>
              </div>
            )}
          </main>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Market Indices */}
            <div className="border-border bg-card rounded-[var(--radius)] border p-4">
              <h3 className="mb-4 font-serif text-lg font-semibold">Indices</h3>
              {snapshotLoading ? (
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonSidebarItem key={i} />
                  ))}
                </div>
              ) : snapshot ? (
                <div className="space-y-3">
                  {snapshot.indices.map((index) => {
                    const isPositive = index.change_percent >= 0;
                    return (
                      <div key={index.symbol} className="flex items-center justify-between">
                        <span className="font-medium">{index.name}</span>
                        <div className="text-right">
                          <span className="block font-mono">{index.price.toLocaleString()}</span>
                          <span
                            className={`font-mono text-xs ${
                              isPositive ? "text-primary" : "text-destructive"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {index.change_percent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <TopMarketCap />
            <DailyMovers />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
