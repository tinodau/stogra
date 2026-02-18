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
    <section className="bg-muted/30 w-full py-8 lg:py-16">
      <div className="container mx-auto w-full px-4">
        {status && (
          <div className="mb-4 flex justify-center sm:mb-6">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm ${
                status.isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${status.isOpen ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
              />
              <span>
                {status.exchange} {status.isOpen ? "Open" : "Closed"}
              </span>
              {status.isOpen && (
                <span className="text-muted-foreground hidden sm:inline">
                  • {status.countdown} left
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-foreground font-serif text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Markets Rally as Tech Leads Gains
          </h1>
          <p className="text-muted-foreground mt-3 text-base sm:mt-4 sm:text-lg">
            Professional US market monitoring with editorial precision.
          </p>

          {snapshotLoading ? (
            <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonSidebarItem key={i} />
              ))}
            </div>
          ) : (
            snapshot && (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
                {snapshot.indices.map((index) => {
                  const isPositive = index.change_percent >= 0;
                  return (
                    <div
                      key={index.symbol}
                      className="border-border bg-card rounded-(--radius) border px-2 py-2 sm:px-4 sm:py-3 lg:px-6"
                    >
                      <span className="text-muted-foreground block truncate text-[10px] font-medium sm:text-xs">
                        {index.name}
                      </span>
                      <div className="mt-0.5 flex items-center gap-1 sm:mt-1 sm:gap-2">
                        <span className="font-mono text-sm font-semibold sm:text-base lg:text-lg">
                          {index.price.toLocaleString()}
                        </span>
                        <span
                          className={`hidden items-center gap-0.5 font-mono text-[10px] sm:flex sm:text-xs ${
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

          <div className="mt-6 flex justify-center sm:mt-8">
            <SearchBar onAdd={onAddStock} />
          </div>
        </div>
      </div>
    </section>
  );
}
