# Technical Specification: Stogra

This document outlines the specific logic, algorithms, and state management rules for the Stogra MVP.

## 1. Feature Logic: Search & Discovery

### 1.1 Hero Search Implementation

- **Intent**: The primary entry point for users to track a new US stock.
- **Search Type**: Server-side filtering via `yfinance`.
- **Debounce**: 300ms. To prevent excessive API calls, the frontend must wait for the user to stop typing before hitting the `/api/search` endpoint.
- **Results Display**:
  - Max 5 results in the dropdown.
  - Show: Ticker Symbol, Full Company Name, and Exchange.
  - Action: Clicking a result adds it to the **LocalStorage Watchlist** and navigates to the detail view (if applicable).

## 2. Feature Logic: Watchlist & Persistence

### 2.1 LocalStorage Schema

Since Phase 1 uses no database, the watchlist is managed entirely in the browser.

- **Key**: `stogra_watchlist`
- **Structure**: An array of strings (Symbols).
- **Example**: `["AAPL", "TSLA", "NVDA"]`

### 2.2 Watchlist Synchronization

- **On Load**: Frontend reads the array from `localStorage` and sends a bulk request to `/api/stocks?symbols=...`.
- **On Add**: Append new symbol to array -> Update `localStorage` -> Trigger TanStack Query refetch.
- **On Remove**: Filter symbol out of array -> Update `localStorage` -> Update local cache.

## 3. Data Fetching & Polling Strategy

### 3.1 Frequency

To balance "real-time" feel with API rate limits (Yahoo Finance):

- **Watchlist Data**: Refetch every 60 seconds when the tab is active (`staleTime: 60000`).
- **Market Snapshot**: Refetch every 5 minutes.
- **Focus Refetch**: When the user switches back to the Stogra tab, TanStack Query should trigger a background refresh.

### 3.2 Loading States

- **Initial Load**: Use **Skeleton Loaders** (Shadcn) that match the dimensions of the stock cards.
- **Background Update**: Show a subtle "Syncing" indicator (tiny teal dot/spinner) in the Navbar status bar.

## 4. Visual Logic (Sparklines)

### 4.1 Data Transformation

- **Input**: An array of closing prices from the backend (e.g., `[150.1, 152.3, 151.0, ...]`).
- **Normalization**: Sparklines must scale to fit the card width.
- **Dynamic Coloring**:
  - If `current_price >= first_price_in_array` -> Use `--primary` (Teal).
  - If `current_price < first_price_in_array` -> Use `--destructive` (Red).

## 5. Backend Logic (FastAPI)

### 5.1 yfinance Integration

- **Wrapper**: Create a service layer to wrap `yfinance` calls.
- **Error Handling**:
  - If a ticker is invalid, return a 404 with `{ "error": "Invalid Ticker" }`.
  - Implement a timeout of 5 seconds for upstream calls to ensure the backend doesn't hang.

### 5.2 Performance Optimization

- **Concurrent Requests**: Use `asyncio.gather` for fetching multiple stock data points in a single `/api/stocks` request to minimize total response time.

## 6. Route Management (TanStack Router)

### 6.1 Defined Routes

- `/`: The Hero-centered Homepage with Watchlist and Sidebar.
- `/stock/$symbol`: (Optional Phase 1) Deep-dive view for a specific stock.
- `/*`: 404 Editorial page (Journal style: "Page Not Found - Market Closed").

## 7. Responsive Rules

- **Desktop**: 3-column editorial grid.
- **Tablet**: 2-column (Sidebar moves below the main feed).
- **Mobile**: Single column (Stacked). Search remains the top priority.
