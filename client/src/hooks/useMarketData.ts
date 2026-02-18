/**
 * useMarketData Hook
 * Fetches market snapshot and stock data using TanStack Query
 * Uses real API when VITE_API_URL is set, otherwise falls back to mock data
 */

import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/api/mock-data";
import { api, isUsingRealApi } from "@/api/api";
import type {
  StockData,
  MarketSnapshot,
  MarketStatus,
  Sector,
  FeaturedNews,
  NewsItem,
  EarningEvent,
  AnalystRating,
  DividendStock,
  WeekHighLow,
} from "@/types";

// Unified API that switches between real and mock
const service = isUsingRealApi ? api : mockApi;

// Query keys
export const queryKeys = {
  marketSnapshot: ["market", "snapshot"] as const,
  marketStatus: ["market", "status"] as const,
  sectors: ["market", "sectors"] as const,
  featuredNews: ["market", "featuredNews"] as const,
  news: ["market", "news"] as const,
  earnings: ["market", "earnings"] as const,
  ratings: ["market", "ratings"] as const,
  dividends: ["market", "dividends"] as const,
  weekHighsLows: ["market", "weekHighsLows"] as const,
  stock: (symbol: string) => ["stock", symbol] as const,
  stocks: (symbols: string[]) => ["stocks", symbols] as const,
  stocksBySector: (sector: string) => ["stocks", "sector", sector] as const,
};

// Get market snapshot (indices + top movers)
export function useMarketSnapshot() {
  return useQuery<MarketSnapshot>({
    queryKey: queryKeys.marketSnapshot,
    queryFn: () => service.getMarketSnapshot(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get data for a single stock
export function useStock(symbol: string) {
  return useQuery<StockData | undefined>({
    queryKey: queryKeys.stock(symbol),
    queryFn: async () => {
      const data = await service.getStocks([symbol]);
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
    queryFn: () => service.getStocks(symbols),
    refetchInterval: 60 * 1000, // 1 minute
    enabled: symbols.length > 0,
  });
}

// Get top market cap stocks
export function useTopMarketCap(limit: number = 10) {
  const topSymbols = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "NVDA",
    "META",
    "BRK-B",
    "UNH",
    "JNJ",
    "XOM",
  ];
  return useQuery<StockData[]>({
    queryKey: ["stocks", "top", limit],
    queryFn: () => service.getStocks(topSymbols.slice(0, limit)),
    refetchInterval: 60 * 1000,
  });
}

// Get daily movers (volatile stocks)
export function useDailyMovers(limit: number = 5) {
  return useQuery<StockData[]>({
    queryKey: ["stocks", "movers", limit],
    queryFn: () => service.getStocks(["NVDA", "TSLA", "META", "AMD", "NFLX"]),
    refetchInterval: 60 * 1000,
  });
}

// Get market status (open/closed)
export function useMarketStatus() {
  return useQuery<MarketStatus>({
    queryKey: queryKeys.marketStatus,
    queryFn: () => service.getMarketStatus(),
    refetchInterval: 60 * 1000,
  });
}

// Get sector performance
export function useSectors() {
  return useQuery<Sector[]>({
    queryKey: queryKeys.sectors,
    queryFn: () => service.getSectors(),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}

// Get featured news
export function useFeaturedNews() {
  return useQuery<FeaturedNews>({
    queryKey: queryKeys.featuredNews,
    queryFn: () => service.getFeaturedNews(),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}

// Get stocks by sector
export function useStocksBySector(sector: string) {
  return useQuery<StockData[]>({
    queryKey: queryKeys.stocksBySector(sector),
    queryFn: () => service.getStocksBySector(sector),
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
  });
}

// Get market news
export function useNews(limit: number = 6) {
  return useQuery<NewsItem[]>({
    queryKey: [...queryKeys.news, limit],
    queryFn: () => service.getNews(limit),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}

// Get earnings calendar
export function useEarnings(limit: number = 8) {
  return useQuery<EarningEvent[]>({
    queryKey: [...queryKeys.earnings, limit],
    queryFn: () => service.getEarnings(limit),
    refetchInterval: 60 * 60 * 1000,
    staleTime: 30 * 60 * 1000,
  });
}

// Get analyst ratings
export function useAnalystRatings(limit: number = 6) {
  return useQuery<AnalystRating[]>({
    queryKey: [...queryKeys.ratings, limit],
    queryFn: () => service.getAnalystRatings(limit),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}

// Get dividend stocks
export function useDividendStocks(limit: number = 6) {
  return useQuery<DividendStock[]>({
    queryKey: [...queryKeys.dividends, limit],
    queryFn: () => service.getDividendStocks(limit),
    refetchInterval: 60 * 60 * 1000,
    staleTime: 30 * 60 * 1000,
  });
}

// Get 52-week highs/lows
export function useWeekHighsLows() {
  return useQuery<{ highs: WeekHighLow[]; lows: WeekHighLow[] }>({
    queryKey: queryKeys.weekHighsLows,
    queryFn: () => service.getWeekHighsLows(),
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}
