import { TrendingUp, TrendingDown } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useMarketStatus, useMarketSnapshot } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

interface HeroSectionProps {
  onAddStock: (symbol: string) => void;
}

export function HeroSection({ onAddStock }: HeroSectionProps) {
  const { data: status } = useMarketStatus();
  const { data: snapshot, isLoading: snapshotLoading } = useMarketSnapshot();

  return (
    <section className="bg-muted/30 w-full py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Market Status Badge */}
        {status && (
          <div className="mb-6 flex justify-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                status.isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
              />
              <span>
                {status.exchange} {status.isOpen ? "Open" : "Closed"}
              </span>
              {status.isOpen && (
                <span className="text-muted-foreground">• {status.countdown} left</span>
              )}
            </div>
          </div>
        )}

        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-foreground font-serif text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Markets Rally as Tech Leads Gains
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Professional US market monitoring with editorial precision.
          </p>

          {/* Quick Stats Row */}
          {snapshotLoading ? (
            <div className="mt-8 flex justify-center gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonSidebarItem key={i} />
              ))}
            </div>
          ) : (
            snapshot && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {snapshot.indices.map((index) => {
                  const isPositive = index.change_percent >= 0;
                  return (
                    <div
                      key={index.symbol}
                      className="border-border bg-card rounded-(--radius) border px-6 py-3"
                    >
                      <span className="text-muted-foreground block text-xs font-medium">
                        {index.name}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-lg font-semibold">
                          {index.price.toLocaleString()}
                        </span>
                        <span
                          className={`flex items-center gap-0.5 font-mono text-sm ${
                            isPositive ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {isPositive ? "+" : ""}
                          {index.change_percent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Search Bar */}
          <div className="mt-8 flex justify-center">
            <SearchBar onAdd={onAddStock} />
          </div>
        </div>
      </div>
    </section>
  );
}
