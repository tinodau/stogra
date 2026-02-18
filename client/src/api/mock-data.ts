/**
 * Stogra Mock Data Service
 * Simulates API responses for development without backend
 */

import type { SearchResult, StockData, MarketSnapshot } from "@/types";

// Simulated delay for realistic loading states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Common US stocks for search
export const MOCK_STOCKS: SearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", type: "Equity" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", exchange: "NASDAQ", type: "Equity" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", type: "Equity" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "BRK-B", name: "Berkshire Hathaway Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", type: "Equity" },
  { symbol: "XOM", name: "Exxon Mobil Corporation", exchange: "NYSE", type: "Equity" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", type: "Equity" },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE", type: "Equity" },
  { symbol: "MA", name: "Mastercard Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "HD", name: "Home Depot Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "CVX", name: "Chevron Corporation", exchange: "NYSE", type: "Equity" },
  { symbol: "KO", name: "Coca-Cola Co.", exchange: "NYSE", type: "Equity" },
  { symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "CRM", name: "Salesforce Inc.", exchange: "NYSE", type: "Equity" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ", type: "Equity" },
];

// Generate sparkline data (7 data points trending in a direction)
const generateSparkline = (basePrice: number, trend: "up" | "down" | "flat"): number[] => {
  const points: number[] = [basePrice];
  let current = basePrice;

  for (let i = 0; i < 6; i++) {
    const volatility = basePrice * 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility;

    if (trend === "up") current += Math.abs(change) * 0.7;
    else if (trend === "down") current -= Math.abs(change) * 0.7;
    else current += change;

    points.push(Math.max(current, 0.01));
  }

  return points.map((p) => Math.round(p * 100) / 100);
};

// Mock stock data with prices
export const MOCK_STOCK_DATA: Record<string, StockData> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.92,
    change: 1.45,
    change_percent: 0.78,
    market_cap: 2800000000000,
    sparkline: generateSparkline(184.47, "up"),
    currency: "USD",
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 420.55,
    change: -2.3,
    change_percent: -0.54,
    market_cap: 3120000000000,
    sparkline: generateSparkline(422.85, "down"),
    currency: "USD",
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 726.13,
    change: 17.32,
    change_percent: 2.44,
    market_cap: 1800000000000,
    sparkline: generateSparkline(708.81, "up"),
    currency: "USD",
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 202.64,
    change: -8.21,
    change_percent: -3.89,
    market_cap: 645000000000,
    sparkline: generateSparkline(210.85, "down"),
    currency: "USD",
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.35,
    change: 2.15,
    change_percent: 1.22,
    market_cap: 1850000000000,
    sparkline: generateSparkline(176.2, "up"),
    currency: "USD",
  },
  META: {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 505.68,
    change: 5.42,
    change_percent: 1.08,
    market_cap: 1290000000000,
    sparkline: generateSparkline(500.26, "up"),
    currency: "USD",
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc. Class A",
    price: 141.8,
    change: -0.92,
    change_percent: -0.64,
    market_cap: 1750000000000,
    sparkline: generateSparkline(142.72, "flat"),
    currency: "USD",
  },
  BRK_B: {
    symbol: "BRK-B",
    name: "Berkshire Hathaway Inc.",
    price: 412.85,
    change: 1.23,
    change_percent: 0.3,
    market_cap: 890000000000,
    sparkline: generateSparkline(411.62, "up"),
    currency: "USD",
  },
  UNH: {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 520.15,
    change: -3.45,
    change_percent: -0.66,
    market_cap: 480000000000,
    sparkline: generateSparkline(523.6, "down"),
    currency: "USD",
  },
  JNJ: {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 162.42,
    change: 0.58,
    change_percent: 0.36,
    market_cap: 390000000000,
    sparkline: generateSparkline(161.84, "up"),
    currency: "USD",
  },
  V: {
    symbol: "V",
    name: "Visa Inc.",
    price: 280.35,
    change: 1.25,
    change_percent: 0.45,
    market_cap: 580000000000,
    sparkline: generateSparkline(279.1, "up"),
    currency: "USD",
  },
  XOM: {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    price: 116.82,
    change: -0.45,
    change_percent: -0.38,
    market_cap: 465000000000,
    sparkline: generateSparkline(117.27, "down"),
    currency: "USD",
  },
  JPM: {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 195.42,
    change: 2.18,
    change_percent: 1.13,
    market_cap: 565000000000,
    sparkline: generateSparkline(193.24, "up"),
    currency: "USD",
  },
  WMT: {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 175.28,
    change: -1.12,
    change_percent: -0.64,
    market_cap: 470000000000,
    sparkline: generateSparkline(176.4, "down"),
    currency: "USD",
  },
};

// Mock API Functions
export const mockApi = {
  // Search for tickers
  async search(query: string): Promise<SearchResult[]> {
    await delay(300); // Simulate network latency
    const q = query.toLowerCase();
    return MOCK_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 5);
  },

  // Get stock data (single or multiple)
  async getStocks(symbols: string[]): Promise<StockData[]> {
    await delay(500);
    return symbols.map((sym) => MOCK_STOCK_DATA[sym.toUpperCase()]).filter(Boolean);
  },

  // Get market snapshot
  async getMarketSnapshot(): Promise<MarketSnapshot> {
    await delay(400);
    return {
      indices: [
        {
          symbol: "^GSPC",
          name: "S&P 500",
          price: 5005.57,
          change_percent: 0.12,
        },
        {
          symbol: "^IXIC",
          name: "Nasdaq",
          price: 15859.15,
          change_percent: -0.3,
        },
        {
          symbol: "^DJI",
          name: "Dow Jones",
          price: 38627.99,
          change_percent: 0.25,
        },
      ],
      top_movers: [
        { symbol: "NVDA", name: "NVIDIA Corp", price: 726.13, change_percent: 2.44 },
        { symbol: "TSLA", name: "Tesla Inc.", price: 202.64, change_percent: -3.89 },
        { symbol: "META", name: "Meta Platforms", price: 505.68, change_percent: 1.08 },
        { symbol: "AMD", name: "AMD Inc.", price: 178.92, change_percent: 4.12 },
        { symbol: "NFLX", name: "Netflix Inc.", price: 628.45, change_percent: -2.15 },
      ],
    };
  },
};
