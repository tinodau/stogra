import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TickerMarquee } from "./TickerMarquee";
import { useMarketStatus, useMarketSnapshot } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

interface HeroSectionProps {
  onAddStock: (symbol: string) => void;
}

export function HeroSection({ onAddStock }: HeroSectionProps) {
  const { data: status } = useMarketStatus();
  const { data: snapshot, isLoading: snapshotLoading } = useMarketSnapshot();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-muted/30 relative w-full overflow-hidden py-8 lg:py-16">
      <TickerMarquee />

      <div className="relative z-10 container mx-auto w-full px-4">
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex justify-center sm:mb-6"
          >
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
          </motion.div>
        )}

        <div ref={ref} className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-foreground font-serif text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          >
            Markets Rally as Tech Leads Gains
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-muted-foreground mt-3 text-base sm:mt-4 sm:text-lg"
          >
            Professional US market monitoring with editorial precision.
          </motion.p>

          {snapshotLoading ? (
            <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonSidebarItem key={i} />
              ))}
            </div>
          ) : (
            snapshot && (
              <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
                {snapshot.indices.map((index, i) => {
                  const isPositive = index.change_percent >= 0;
                  return (
                    <motion.div
                      key={index.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                      className="border-border bg-card rounded-(--radius) border px-2 py-2 sm:px-4 sm:py-3 lg:px-6"
                    >
                      <span className="text-muted-foreground block text-center text-[10px] font-medium sm:text-xs">
                        {index.name}
                      </span>
                      <div className="mt-0.5 text-center sm:mt-1">
                        <span className="font-mono text-sm font-semibold sm:text-base lg:text-lg">
                          {index.price.toLocaleString()}
                        </span>
                        <div
                          className={`mt-0.5 flex items-center justify-center gap-0.5 font-mono text-[10px] sm:text-xs ${
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
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="mt-6 flex justify-center sm:mt-8"
          >
            <SearchBar onAdd={onAddStock} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
