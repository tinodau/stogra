import { useWatchlist } from "@/hooks/useWatchlist";
import { useStocks, useMarketSnapshot, useStocksBySector } from "@/hooks/useMarketData";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StockCard } from "@/components/StockCard";
import { FeaturedStocks } from "@/components/FeaturedStocks";
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
import { SkeletonCard, SkeletonSidebarItem } from "@/components/SkeletonCard";

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
            {watchlist.length > 0 ? (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold">Watchlist</h2>
                  <span className="text-muted-foreground text-sm">{watchlist.length} stocks</span>
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
                ) : null}
              </section>
            ) : (
              <section>
                {featuredLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : featuredStocks ? (
                  <FeaturedStocks stocks={featuredStocks} onAdd={add} />
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
          </main>

          <aside className="min-w-0 space-y-4 sm:space-y-6">
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
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
