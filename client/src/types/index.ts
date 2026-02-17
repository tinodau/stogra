/**
 * Stogra Type Definitions
 * Matches the API Contract specification
 */

// Search Result from /api/search
export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

// Stock Data from /api/stocks
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap: number | null;
  sparkline: number[];
  currency: string;
}

// Market Index from /api/market/snapshot
export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
}

// Daily Mover from /api/market/snapshot
export interface DailyMover {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
}

// Full Market Snapshot
export interface MarketSnapshot {
  indices: MarketIndex[];
  top_movers: DailyMover[];
}
