import { useWatchlist } from "@/hooks/useWatchlist";
import { useStocks, useMarketSnapshot, useStocksBySector } from "@/hooks/useMarketData";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StockList } from "@/components/StockList";
import { MarketNews } from "@/components/MarketNews";
import { EarningsCalendar } from "@/components/EarningsCalendar";
import { AnalystRatings } from "@/components/AnalystRatings";
import { DividendStocks } from "@/components/DividendStocks";
import { TopMarketCap } from "@/components/TopMarketCap";
import { DailyMovers } from "@/components/DailyMovers";
import { MarketHours } from "@/components/MarketHours";
import { SectorPerformance } from "@/components/SectorPerformance";
import { EarningsMini } from "@/components/EarningsMini";
import { Footer } from "@/components/Footer";
import { SkeletonSidebarItem } from "@/components/SkeletonCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function App() {
  const { watchlist, remove, add } = useWatchlist();
  const { data: watchlistData, isLoading } = useStocks(watchlist);
  const { data: snapshot, isLoading: snapshotLoading } = useMarketSnapshot();
  const { data: featuredStocks, isLoading: featuredLoading } = useStocksBySector("all");

  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden font-sans antialiased">
      <Navbar />

      <HeroSection onAddStock={add} />

      <div className="container mx-auto w-full flex-1 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <main className="min-w-0 space-y-12">
            <ErrorBoundary>
              {watchlist.length > 0 ? (
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold sm:text-2xl">Watchlist</h2>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {watchlist.length} stocks
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonSidebarItem key={i} />
                      ))}
                    </div>
                  ) : watchlistData && watchlistData.length > 0 ? (
                    <StockList stocks={watchlistData} onRemove={remove} />
                  ) : null}
                </section>
              ) : (
                <section>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h2 className="font-serif text-lg font-semibold sm:text-xl">Trending Today</h2>
                  </div>

                  {featuredLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonSidebarItem key={i} />
                      ))}
                    </div>
                  ) : featuredStocks ? (
                    <StockList stocks={featuredStocks} onAdd={add} />
                  ) : null}
                </section>
              )}

              <section>
                <MarketNews />
              </section>

              <section>
                <EarningsCalendar />
              </section>

              <section>
                <AnalystRatings />
              </section>

              <section>
                <DividendStocks />
              </section>
            </ErrorBoundary>
          </main>

          <aside className="min-w-0 space-y-4 sm:space-y-6">
            <ErrorBoundary>
              <MarketHours />

              <div className="border-border bg-card rounded-(--radius) border p-4">
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

              <SectorPerformance />
              <EarningsMini />
              <TopMarketCap />
              <DailyMovers />
            </ErrorBoundary>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
