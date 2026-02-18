/**
 * Stogra Mock Data Service
 * Simulates API responses for development without backend
 */

import type {
  SearchResult,
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
  AMD: {
    symbol: "AMD",
    name: "Advanced Micro Devices Inc.",
    price: 178.92,
    change: 7.05,
    change_percent: 4.12,
    market_cap: 290000000000,
    sparkline: generateSparkline(171.87, "up"),
    currency: "USD",
  },
  NFLX: {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 628.45,
    change: -13.82,
    change_percent: -2.15,
    market_cap: 270000000000,
    sparkline: generateSparkline(642.27, "down"),
    currency: "USD",
  },
  CRM: {
    symbol: "CRM",
    name: "Salesforce Inc.",
    price: 312.5,
    change: 4.75,
    change_percent: 1.54,
    market_cap: 305000000000,
    sparkline: generateSparkline(307.75, "up"),
    currency: "USD",
  },
  ADBE: {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: 598.32,
    change: 8.45,
    change_percent: 1.43,
    market_cap: 265000000000,
    sparkline: generateSparkline(589.87, "up"),
    currency: "USD",
  },
  INTC: {
    symbol: "INTC",
    name: "Intel Corporation",
    price: 42.15,
    change: -0.68,
    change_percent: -1.59,
    market_cap: 178000000000,
    sparkline: generateSparkline(42.83, "down"),
    currency: "USD",
  },
  MA: {
    symbol: "MA",
    name: "Mastercard Inc.",
    price: 528.45,
    change: 3.22,
    change_percent: 0.61,
    market_cap: 490000000000,
    sparkline: generateSparkline(525.23, "up"),
    currency: "USD",
  },
  HD: {
    symbol: "HD",
    name: "Home Depot Inc.",
    price: 385.72,
    change: -2.15,
    change_percent: -0.55,
    market_cap: 382000000000,
    sparkline: generateSparkline(387.87, "down"),
    currency: "USD",
  },
  CVX: {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 158.32,
    change: 1.85,
    change_percent: 1.18,
    market_cap: 285000000000,
    sparkline: generateSparkline(156.47, "up"),
    currency: "USD",
  },
  KO: {
    symbol: "KO",
    name: "Coca-Cola Co.",
    price: 62.45,
    change: 0.32,
    change_percent: 0.52,
    market_cap: 270000000000,
    sparkline: generateSparkline(62.13, "up"),
    currency: "USD",
  },
  PFE: {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 28.75,
    change: -0.45,
    change_percent: -1.54,
    market_cap: 162000000000,
    sparkline: generateSparkline(29.2, "down"),
    currency: "USD",
  },
  PG: {
    symbol: "PG",
    name: "Procter & Gamble Co.",
    price: 168.92,
    change: 1.15,
    change_percent: 0.69,
    market_cap: 396000000000,
    sparkline: generateSparkline(167.77, "up"),
    currency: "USD",
  },
};

// Market Status
export const MOCK_MARKET_STATUS: MarketStatus = {
  isOpen: true,
  exchange: "NYSE",
  nextEvent: "close",
  countdown: "4h 23m",
  openTime: "9:30 AM ET",
  closeTime: "4:00 PM ET",
};

// Sector Performance
export const MOCK_SECTORS: Sector[] = [
  { name: "Technology", change_percent: 1.24 },
  { name: "Finance", change_percent: 0.52 },
  { name: "Energy", change_percent: -0.78 },
  { name: "Healthcare", change_percent: 0.35 },
  { name: "Consumer", change_percent: -0.21 },
];

// Featured News
export const MOCK_FEATURED_NEWS: FeaturedNews = {
  title: "NVIDIA Surges on AI Demand",
  symbol: "NVDA",
  summary:
    "NVIDIA shares rally as AI chip demand continues to drive growth in the semiconductor sector.",
};

// Sector Stocks Mapping
export const SECTOR_STOCKS: Record<string, string[]> = {
  all: ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AMZN", "TSLA", "AMD", "JPM", "JNJ"],
  tech: ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AMD", "NFLX", "ADBE", "CRM", "INTC"],
  finance: ["JPM", "V", "MA", "BRK-B", "BAC", "GS", "MS", "AXP", "BLK", "C"],
  energy: ["XOM", "CVX", "COP", "SLB", "EOG", "PXD", "MPC", "VLO", "PSX", "OXY"],
  healthcare: ["JNJ", "UNH", "PFE", "ABBV", "MRK", "LLY", "TMO", "ABT", "DHR", "BMY"],
};

// Market News (yfinance-compatible structure)
export const MOCK_NEWS: NewsItem[] = [
  {
    title: "NVIDIA Surges on Record AI Chip Demand",
    publisher: "Reuters",
    link: "https://www.reuters.com/technology/nvidia",
    published_at: "2025-02-18T14:30:00Z",
    related_stocks: ["NVDA", "AMD"],
  },
  {
    title: "Tesla Deliveries Miss Estimates Amid Production Challenges",
    publisher: "Bloomberg",
    link: "https://www.bloomberg.com/tesla",
    published_at: "2025-02-18T12:00:00Z",
    related_stocks: ["TSLA"],
  },
  {
    title: "Fed Signals Potential Rate Cuts in 2025",
    publisher: "Wall Street Journal",
    link: "https://www.wsj.com/economy",
    published_at: "2025-02-18T11:00:00Z",
    related_stocks: [],
  },
  {
    title: "Apple Vision Pro Sales Exceed Expectations",
    publisher: "CNBC",
    link: "https://www.cnbc.com/apple",
    published_at: "2025-02-18T10:00:00Z",
    related_stocks: ["AAPL"],
  },
  {
    title: "Meta Announces Major AI Investment Initiative",
    publisher: "TechCrunch",
    link: "https://techcrunch.com/meta",
    published_at: "2025-02-18T08:00:00Z",
    related_stocks: ["META", "NVDA"],
  },
  {
    title: "Oil Prices Slip on Demand Concerns",
    publisher: "Reuters",
    link: "https://www.reuters.com/markets",
    published_at: "2025-02-18T06:00:00Z",
    related_stocks: ["XOM", "CVX"],
  },
];

// Earnings Calendar
export const MOCK_EARNINGS: EarningEvent[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    date: "Feb 21",
    time: "after_market",
    expected_eps: 4.59,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    date: "Feb 20",
    time: "after_market",
    expected_eps: 2.1,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    date: "Feb 22",
    time: "after_market",
    expected_eps: 2.78,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    date: "Feb 25",
    time: "after_market",
    expected_eps: 0.73,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    date: "Feb 26",
    time: "after_market",
    expected_eps: 0.8,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    date: "Feb 27",
    time: "after_market",
    expected_eps: 4.95,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    date: "Feb 28",
    time: "after_market",
    expected_eps: 1.59,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    date: "Mar 1",
    time: "before_market",
    expected_eps: 4.12,
  },
];

// Analyst Ratings (adapted to yfinance - only buy/hold/sell)
export const MOCK_RATINGS: AnalystRating[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    rating: "buy",
    rating_score: 4.8,
    target_price: 850,
    current_price: 726.13,
    upside_percent: 17.06,
    analyst_count: 42,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    rating: "buy",
    rating_score: 4.2,
    target_price: 210,
    current_price: 185.92,
    upside_percent: 12.95,
    analyst_count: 38,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    rating: "buy",
    rating_score: 4.4,
    target_price: 450,
    current_price: 420.55,
    upside_percent: 7.01,
    analyst_count: 35,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    rating: "hold",
    rating_score: 3.2,
    target_price: 220,
    current_price: 202.64,
    upside_percent: 8.56,
    analyst_count: 28,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    rating: "buy",
    rating_score: 4.3,
    target_price: 580,
    current_price: 505.68,
    upside_percent: 14.69,
    analyst_count: 32,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    rating: "buy",
    rating_score: 4.5,
    target_price: 205,
    current_price: 178.35,
    upside_percent: 14.93,
    analyst_count: 40,
  },
];

// Dividend Stocks
export const MOCK_DIVIDENDS: DividendStock[] = [
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 158.32,
    dividend_yield: 4.02,
    annual_dividend: 6.52,
    payout_frequency: "quarterly",
    ex_dividend_date: "Feb 15",
  },
  {
    symbol: "KO",
    name: "Coca-Cola Co.",
    price: 62.45,
    dividend_yield: 3.12,
    annual_dividend: 1.94,
    payout_frequency: "quarterly",
    ex_dividend_date: "Mar 1",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 162.42,
    dividend_yield: 2.98,
    annual_dividend: 4.76,
    payout_frequency: "quarterly",
    ex_dividend_date: "Feb 20",
  },
  {
    symbol: "PG",
    name: "Procter & Gamble Co.",
    price: 168.92,
    dividend_yield: 2.45,
    annual_dividend: 4.03,
    payout_frequency: "quarterly",
    ex_dividend_date: "Feb 22",
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    price: 116.82,
    dividend_yield: 3.65,
    annual_dividend: 4.28,
    payout_frequency: "quarterly",
    ex_dividend_date: "Feb 10",
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 28.75,
    dividend_yield: 5.42,
    annual_dividend: 1.56,
    payout_frequency: "quarterly",
    ex_dividend_date: "Feb 25",
  },
];

// 52-Week Highs/Lows
export const MOCK_WEEK_HIGHS: WeekHighLow[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 726.13,
    week_high: 726.13,
    week_low: 392.0,
    percent_from_high: 0,
    is_new_high: true,
    is_new_low: false,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 505.68,
    week_high: 512.0,
    week_low: 88.0,
    percent_from_high: 1.23,
    is_new_high: false,
    is_new_low: false,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 420.55,
    week_high: 430.0,
    week_low: 245.0,
    percent_from_high: 2.2,
    is_new_high: false,
    is_new_low: false,
  },
];

export const MOCK_WEEK_LOWS: WeekHighLow[] = [
  {
    symbol: "INTC",
    name: "Intel Corporation",
    price: 42.15,
    week_high: 68.0,
    week_low: 42.15,
    percent_from_high: 38.01,
    is_new_high: false,
    is_new_low: true,
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 28.75,
    week_high: 42.0,
    week_low: 28.75,
    percent_from_high: 31.55,
    is_new_high: false,
    is_new_low: true,
  },
];

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

  // Get market status
  async getMarketStatus(): Promise<MarketStatus> {
    await delay(200);
    return MOCK_MARKET_STATUS;
  },

  // Get sector performance
  async getSectors(): Promise<Sector[]> {
    await delay(300);
    return MOCK_SECTORS;
  },

  // Get featured news
  async getFeaturedNews(): Promise<FeaturedNews> {
    await delay(200);
    return MOCK_FEATURED_NEWS;
  },

  // Get stocks by sector
  async getStocksBySector(sector: string): Promise<StockData[]> {
    await delay(400);
    const symbols = SECTOR_STOCKS[sector] || SECTOR_STOCKS.all;
    return symbols.map((sym) => MOCK_STOCK_DATA[sym]).filter(Boolean);
  },

  // Get market news
  async getNews(limit: number = 6): Promise<NewsItem[]> {
    await delay(350);
    return MOCK_NEWS.slice(0, limit);
  },

  // Get earnings calendar
  async getEarnings(limit: number = 8): Promise<EarningEvent[]> {
    await delay(300);
    return MOCK_EARNINGS.slice(0, limit);
  },

  // Get analyst ratings
  async getAnalystRatings(limit: number = 6): Promise<AnalystRating[]> {
    await delay(350);
    return MOCK_RATINGS.slice(0, limit);
  },

  // Get dividend stocks
  async getDividendStocks(limit: number = 6): Promise<DividendStock[]> {
    await delay(300);
    return MOCK_DIVIDENDS.slice(0, limit);
  },

  // Get 52-week highs/lows
  async getWeekHighsLows(): Promise<{ highs: WeekHighLow[]; lows: WeekHighLow[] }> {
    await delay(300);
    return { highs: MOCK_WEEK_HIGHS, lows: MOCK_WEEK_LOWS };
  },
};
