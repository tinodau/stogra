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

// Market Status (open/closed)
export interface MarketStatus {
  isOpen: boolean;
  exchange: string;
  nextEvent: "open" | "close";
  countdown: string;
  openTime: string;
  closeTime: string;
}

// Sector Performance
export interface Sector {
  name: string;
  change_percent: number;
}

// Featured News Item
export interface FeaturedNews {
  title: string;
  symbol: string;
  summary: string;
}

// Sector filter type
export type SectorFilter = "all" | "tech" | "finance" | "energy" | "healthcare";

// News Item
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  published_at: string;
  related_stocks: string[];
  sentiment: "positive" | "negative" | "neutral";
  category: "earnings" | "market" | "company" | "economy";
}

// Earnings Event
export interface EarningEvent {
  symbol: string;
  name: string;
  date: string;
  time: "before_market" | "after_market" | "during";
  expected_eps: number | null;
  actual_eps?: number | null;
}

// Analyst Rating
export interface AnalystRating {
  symbol: string;
  name: string;
  rating: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  rating_score: number;
  target_price: number;
  current_price: number;
  upside_percent: number;
  analyst_count: number;
}

// Dividend Stock
export interface DividendStock {
  symbol: string;
  name: string;
  price: number;
  dividend_yield: number;
  annual_dividend: number;
  payout_frequency: "monthly" | "quarterly" | "annual";
  ex_dividend_date: string;
}

// 52-Week Stock
export interface WeekHighLow {
  symbol: string;
  name: string;
  price: number;
  week_high: number;
  week_low: number;
  percent_from_high: number;
  is_new_high: boolean;
  is_new_low: boolean;
}
