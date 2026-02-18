# API Contract — Stogra (Phase 1)

This document defines the interface between the FastAPI backend and the React frontend. All endpoints return JSON and follow standard REST conventions.

## 1. Base URL

- **Local**: `http://localhost:8000`
- **Production**: `PROD_URL_FROM_KOYEB` (Koyeb Tokyo) -- Base URL in production is managed via environment variables (VITE_API_URL for Frontend).

## 2. Endpoints

### 2.1 Search Tickers

Used by the Hero section search bar to find US stocks.

- **Endpoint**: `GET /api/search`
- **Query Params**: `q=[string]` (e.g., `q=apple`)
- **Response**: `200 OK`

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "exchange": "NASDAQ",
    "type": "Equity"
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "exchange": "NASDAQ",
    "type": "Equity"
  }
]
```

### 2.2 Get Multi-Stock Data

Used by the Watchlist and Sidebar to fetch current price data and sparkline points.

- **Endpoint**: `GET /api/stocks`
- **Query Params**: `symbols=[comma-separated-list]` (e.g., symbols=AAPL,TSLA,MSFT)
- **Response**: `200 OK`

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 185.92,
    "change": 1.45,
    "change_percent": 0.78,
    "market_cap": 2800000000000,
    "sparkline": [184.1, 184.5, 185.0, 184.8, 185.92],
    "currency": "USD"
  }
]
```

### 2.3 Market Snapshot

Used for the "The Lead Story" Hero chart and Market Indices.

- **Endpoint**: `GET /api/market/snapshot`
- **Response**: `200 OK`

```json
{
  "indices": [
    {
      "symbol": "^GSPC",
      "name": "S&P 500",
      "price": 5005.57,
      "change_percent": 0.12
    },
    {
      "symbol": "^IXIC",
      "name": "Nasdaq",
      "price": 15859.15,
      "change_percent": -0.3
    }
  ],
  "top_movers": [
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corp",
      "price": 726.13,
      "change_percent": 2.44
    }
  ]
}
```

### 2.4 Health Check

Used by Koyeb to monitor deployment status.

- **Endpoint**: `GET /health`
- **Response**: `200 OK`

```json
{ "status": "operational", "version": "1.0.0" }
```

### 2.5 Market Status

Get current market status (open/closed) based on NYSE trading hours.

- **Endpoint**: `GET /api/market/status`
- **Response**: `200 OK`

```json
{
  "isOpen": true,
  "exchange": "NYSE",
  "nextEvent": "close",
  "countdown": "4h 23m",
  "openTime": "9:30 AM ET",
  "closeTime": "4:00 PM ET"
}
```

### 2.6 Sector Performance

Get sector performance calculated from sector ETFs.

- **Endpoint**: `GET /api/market/sectors`
- **Response**: `200 OK`

```json
[
  { "name": "Technology", "change_percent": 1.24 },
  { "name": "Finance", "change_percent": 0.52 },
  { "name": "Energy", "change_percent": -0.78 },
  { "name": "Healthcare", "change_percent": 0.35 },
  { "name": "Consumer", "change_percent": -0.21 }
]
```

### 2.7 Market News

Get market news from yfinance.

- **Endpoint**: `GET /api/market/news`
- **Query Params**: `limit=[int]` (default: 6, max: 20)
- **Response**: `200 OK`

```json
[
  {
    "title": "NVIDIA Surges on Record AI Chip Demand",
    "publisher": "Reuters",
    "link": "https://www.reuters.com/...",
    "published_at": "2025-02-18T14:30:00Z",
    "related_stocks": ["NVDA", "AMD"]
  }
]
```

### 2.8 Analyst Ratings

Get analyst ratings and price targets.

- **Endpoint**: `GET /api/market/ratings`
- **Query Params**: `limit=[int]` (default: 6, max: 20)
- **Response**: `200 OK`

```json
[
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "rating": "buy",
    "rating_score": 4.8,
    "target_price": 850.0,
    "current_price": 726.13,
    "upside_percent": 17.06,
    "analyst_count": 42
  }
]
```

### 2.9 Earnings Calendar

Get upcoming earnings dates.

- **Endpoint**: `GET /api/market/earnings`
- **Query Params**: `limit=[int]` (default: 8, max: 20)
- **Response**: `200 OK`

```json
[
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "date": "Feb 21",
    "time": "after_market",
    "expected_eps": 4.59
  }
]
```

## 3. Data Constraints

- **Sparkline**: The sparkline array contains 7 to 24 data points representing the closing price trend (daily or hourly).
- **Format**: All numbers are rounded to 2 decimal places except for market_cap (BigInt/Large Integer).
- **US Only**: Symbols follow US conventions (e.g., AAPL for Apple, not AAPL.JK).

## 4. Error Handling

- **404 Not Found**: Returned if a specific ticker does not exist.
- **429 Too Many Requests**: Returned if the API source (yfinance) rate-limits the backend.
- **500 Internal Server Error**: Generic backend failure.

```json
{ "error": "Ticker not found", "code": "NOT_FOUND" }
```
