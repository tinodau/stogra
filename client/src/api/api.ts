/**
 * Stogra API Service
 * Connects to FastAPI backend - uses mock data fallback when VITE_API_URL is not set
 */

import type {
  StockData,
  MarketSnapshot,
  MarketStatus,
  Sector,
  NewsItem,
  FeaturedNews,
  EarningEvent,
  AnalystRating,
  DividendStock,
  WeekHighLow,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "";

// Helper for API calls
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Export API service matching mockApi interface
export const api = {
  // Search for tickers
  async search(query: string) {
    if (!API_URL) return []; // Will use mock in hook
    return apiFetch<Array<{ symbol: string; name: string; exchange: string; type: string }>>(
      `/api/search?q=${encodeURIComponent(query)}`
    );
  },

  // Get stock data (single or multiple)
  async getStocks(symbols: string[]): Promise<StockData[]> {
    if (!API_URL || symbols.length === 0) return [];
    return apiFetch<StockData[]>(`/api/stocks?symbols=${symbols.join(",")}`);
  },

  // Get market snapshot
  async getMarketSnapshot(): Promise<MarketSnapshot> {
    if (!API_URL) {
      return { indices: [], top_movers: [] };
    }
    return apiFetch<MarketSnapshot>("/api/market/snapshot");
  },

  // Get market status
  async getMarketStatus(): Promise<MarketStatus> {
    if (!API_URL) {
      return {
        isOpen: false,
        exchange: "NYSE",
        nextEvent: "open",
        countdown: "",
        openTime: "9:30 AM ET",
        closeTime: "4:00 PM ET",
      };
    }
    return apiFetch<MarketStatus>("/api/market/status");
  },

  // Get sector performance
  async getSectors(): Promise<Sector[]> {
    if (!API_URL) return [];
    return apiFetch<Sector[]>("/api/market/sectors");
  },

  // Get market news
  async getNews(limit: number = 6): Promise<NewsItem[]> {
    if (!API_URL) return [];
    return apiFetch<NewsItem[]>(`/api/market/news?limit=${limit}`);
  },

  // Get earnings calendar
  async getEarnings(limit: number = 8): Promise<EarningEvent[]> {
    if (!API_URL) return [];
    return apiFetch<EarningEvent[]>(`/api/market/earnings?limit=${limit}`);
  },

  // Get analyst ratings
  async getAnalystRatings(limit: number = 6): Promise<AnalystRating[]> {
    if (!API_URL) return [];
    return apiFetch<AnalystRating[]>(`/api/market/ratings?limit=${limit}`);
  },

  // Get dividend stocks
  async getDividendStocks(_limit: number = 6): Promise<DividendStock[]> {
    if (!API_URL) return [];
    return apiFetch<DividendStock[]>(`/api/market/dividends?limit=${_limit}`);
  },

  // Get featured news (single featured story)
  async getFeaturedNews(): Promise<FeaturedNews> {
    if (!API_URL) {
      return { title: "", symbol: "", summary: "" };
    }
    return apiFetch<FeaturedNews>("/api/market/news/featured");
  },

  // Get 52-week highs/lows
  async getWeekHighsLows(): Promise<{ highs: WeekHighLow[]; lows: WeekHighLow[] }> {
    if (!API_URL) return { highs: [], lows: [] };
    return apiFetch<{ highs: WeekHighLow[]; lows: WeekHighLow[] }>("/api/market/week-highs-lows");
  },

  // Get stocks by sector (uses getStocks internally)
  async getStocksBySector(sector: string): Promise<StockData[]> {
    if (!API_URL) return [];
    // Sector filtering is done client-side for now
    // In future, backend could have /api/stocks?sector=tech
    const sectorSymbols: Record<string, string[]> = {
      all: ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AMZN", "TSLA", "AMD", "JPM", "JNJ"],
      tech: ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AMD", "NFLX", "ADBE", "CRM", "INTC"],
      finance: ["JPM", "V", "MA", "BRK-B", "BAC", "GS", "MS", "AXP", "BLK", "C"],
      energy: ["XOM", "CVX", "COP", "SLB", "EOG"],
      healthcare: ["JNJ", "UNH", "PFE", "ABBV", "MRK"],
    };
    const symbols = sectorSymbols[sector] || sectorSymbols.all;
    return this.getStocks(symbols);
  },
};

// Check if we're using real API
export const isUsingRealApi = Boolean(API_URL);
