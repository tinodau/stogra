/**
 * useMarketData Hook
 * Fetches market snapshot and stock data using TanStack Query
 */

import { useQuery, useQueries } from "@tanstack/react-query";
import { mockApi } from "@/api/mock-data";
import type { StockData, MarketSnapshot } from "@/types";

// Query keys
export const queryKeys = {
  marketSnapshot: ["market", "snapshot"] as const,
  stock: (symbol: string) => ["stock", symbol] as const,
  stocks: (symbols: string[]) => ["stocks", symbols] as const,
};

// Get market snapshot (indices + top movers)
export function useMarketSnapshot() {
  return useQuery<MarketSnapshot>({
    queryKey: queryKeys.marketSnapshot,
    queryFn: () => mockApi.getMarketSnapshot(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get data for a single stock
export function useStock(symbol: string) {
  return useQuery<StockData | undefined>({
    queryKey: queryKeys.stock(symbol),
    queryFn: async () => {
      const data = await mockApi.getStocks([symbol]);
      return data[0];
    },
    refetchInterval: 60 * 1000, // 1 minute
    enabled: !!symbol,
  });
}

// Get data for multiple stocks (watchlist)
export function useStocks(symbols: string[]) {
  return useQuery<StockData[]>({
    queryKey: queryKeys.stocks(symbols),
    queryFn: () => mockApi.getStocks(symbols),
    refetchInterval: 60 * 1000, // 1 minute
    enabled: symbols.length > 0,
  });
}

// Get top market cap stocks
export function useTopMarketCap(limit: number = 10) {
  const topSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "BRK-B", "UNH", "JNJ", "XOM"];
  return useQuery<StockData[]>({
    queryKey: ["stocks", "top", limit],
    queryFn: () => mockApi.getStocks(topSymbols.slice(0, limit)),
    refetchInterval: 60 * 1000,
  });
}

// Get daily movers (volatile stocks)
export function useDailyMovers(limit: number = 5) {
  return useQuery<StockData[]>({
    queryKey: ["stocks", "movers", limit],
    queryFn: () => mockApi.getStocks(["NVDA", "TSLA", "META", "AMD", "NFLX"]),
    refetchInterval: 60 * 1000,
  });
}
