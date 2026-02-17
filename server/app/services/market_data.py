"""
Market Data Service - yfinance integration layer
Handles all interactions with Yahoo Finance API
"""

import asyncio
from typing import List, Dict, Any
import yfinance as yf


class MarketDataService:
    """
    Service layer for fetching and processing market data from yfinance
    """

    # Major indices we track
    INDICES = {
        "^GSPC": "S&P 500",
        "^IXIC": "Nasdaq",
        "^DJI": "Dow Jones",
    }

    # Top stocks for "Top Market Cap" and "Daily Movers"
    TOP_SYMBOLS = [
        "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA",
        "META", "TSLA", "BRK-B", "UNH", "JNJ",
        "XOM", "V", "JPM", "WMT", "PG",
    ]

    async def search_tickers(self, query: str) -> List[Dict[str, str]]:
        """
        Search for tickers using yfinance
        Note: yfinance doesn't have a direct search API, so we use a curated list
        for common US equities
        """
        # Common US stocks for demo (in production, use a comprehensive dataset)
        common_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "GOOGL", "name": "Alphabet Inc. Class A", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "GOOG", "name": "Alphabet Inc. Class C", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "META", "name": "Meta Platforms Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "BRK-B", "name": "Berkshire Hathaway Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "UNH", "name": "UnitedHealth Group Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "JNJ", "name": "Johnson & Johnson", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "XOM", "name": "Exxon Mobil Corporation", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "V", "name": "Visa Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "WMT", "name": "Walmart Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "PG", "name": "Procter & Gamble Co.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "MA", "name": "Mastercard Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "HD", "name": "Home Depot Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "CVX", "name": "Chevron Corporation", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "KO", "name": "Coca-Cola Co.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "PFE", "name": "Pfizer Inc.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "MRK", "name": "Merck & Co.", "exchange": "NYSE", "type": "Equity"},
            {"symbol": "CSCO", "name": "Cisco Systems Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "NFLX", "name": "Netflix Inc.", "exchange": "NASDAQ", "type": "Equity"},
            {"symbol": "ADBE", "name": "Adobe Inc.", "exchange": "NASDAQ", "type": "Equity"},
        ]

        query_lower = query.lower()
        results = [
            stock for stock in common_stocks
            if query_lower in stock["symbol"].lower() or query_lower in stock["name"].lower()
        ]

        return results

    async def get_stock_data(self, symbol: str) -> Dict[str, Any] | None:
        """
        Fetch current data for a single stock including sparkline
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="5d", interval="1d")

            if hist.empty:
                return None

            # Calculate sparkline data (last 7-24 points)
            closing_prices = hist["Close"].tolist()
            sparkline = closing_prices[-7:] if len(closing_prices) >= 7 else closing_prices

            # Current price and change
            current_price = hist["Close"].iloc[-1]
            prev_close = info.get("regularMarketPreviousClose") or hist["Close"].iloc[-2] if len(hist) > 1 else current_price
            change = current_price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0

            return {
                "symbol": symbol,
                "name": info.get("longName", info.get("shortName", symbol)),
                "price": round(current_price, 2),
                "change": round(change, 2),
                "change_percent": round(change_percent, 2),
                "market_cap": info.get("marketCap"),
                "sparkline": [round(p, 2) for p in sparkline],
                "currency": info.get("currency", "USD"),
            }
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            return None

    async def get_stocks_batch(self, symbols: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch data for multiple stocks concurrently using asyncio.gather
        """
        tasks = [self.get_stock_data(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        stocks = []
        for result in results:
            if isinstance(result, dict):
                stocks.append(result)
            elif result is not None:
                print(f"Error in batch: {result}")

        return stocks

    async def get_stock_detail(self, symbol: str) -> Dict[str, Any] | None:
        """
        Get detailed data for a single stock (includes more data points)
        """
        return await self.get_stock_data(symbol)

    async def get_index_data(self, symbol: str, name: str) -> Dict[str, Any]:
        """
        Fetch data for a market index
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="2d", interval="1d")

            if hist.empty:
                return {"symbol": symbol, "name": name, "price": 0.0, "change_percent": 0.0}

            current_price = hist["Close"].iloc[-1]
            prev_price = hist["Close"].iloc[-2] if len(hist) > 1 else current_price
            change_percent = ((current_price - prev_price) / prev_price) * 100 if prev_price else 0

            return {
                "symbol": symbol,
                "name": name,
                "price": round(current_price, 2),
                "change_percent": round(change_percent, 2),
            }
        except Exception as e:
            print(f"Error fetching index {symbol}: {e}")
            return {"symbol": symbol, "name": name, "price": 0.0, "change_percent": 0.0}

    async def get_market_snapshot(self) -> Dict[str, Any]:
        """
        Get full market snapshot: indices and top movers
        """
        # Fetch index data concurrently
        index_tasks = [
            self.get_index_data(symbol, name)
            for symbol, name in self.INDICES.items()
        ]
        indices = await asyncio.gather(*index_tasks)

        # Fetch top stocks for movers
        top_stocks = await self.get_stocks_batch(self.TOP_SYMBOLS[:15])

        # Sort by absolute change percentage to find movers
        movers = sorted(
            top_stocks,
            key=lambda x: abs(x.get("change_percent", 0)),
            reverse=True
        )[:5]  # Top 5 movers

        # Format movers
        formatted_movers = [
            {
                "symbol": s["symbol"],
                "name": s["name"],
                "price": s["price"],
                "change_percent": s["change_percent"],
            }
            for s in movers
        ]

        return {
            "indices": list(indices),
            "top_movers": formatted_movers,
        }
