"""
Market Data Service - yfinance integration layer
Handles all interactions with Yahoo Finance API
"""

import asyncio
from datetime import datetime, time, timedelta
from typing import List, Dict, Any, Optional
import yfinance as yf
import pytz
from functools import lru_cache


class CacheEntry:
    def __init__(self, data: Any, ttl_seconds: int = 60):
        self.data = data
        self.expires_at = datetime.now() + timedelta(seconds=ttl_seconds)

    def is_valid(self) -> bool:
        return datetime.now() < self.expires_at


class MarketDataService:
    """
    Service layer for fetching and processing market data from yfinance
    """

    # In-memory cache
    _cache: Dict[str, CacheEntry] = {}

    # Major indices we track
    INDICES = {
        "^GSPC": "S&P 500",
        "^IXIC": "Nasdaq",
        "^DJI": "Dow Jones",
    }

    # Sector ETFs for sector performance
    SECTOR_ETFS = {
        "Technology": "XLK",
        "Finance": "XLF",
        "Energy": "XLE",
        "Healthcare": "XLV",
        "Consumer": "XLP",
    }

    # Top stocks for "Top Market Cap" and "Daily Movers"
    TOP_SYMBOLS = [
        "AAPL",
        "MSFT",
        "GOOGL",
        "AMZN",
        "NVDA",
        "META",
        "TSLA",
        "BRK-B",
        "UNH",
        "JNJ",
        "XOM",
        "V",
        "JPM",
        "WMT",
        "PG",
    ]

    # Stocks with news (for fetching news)
    NEWS_SYMBOLS = ["NVDA", "AAPL", "TSLA", "META", "AMZN", "MSFT", "GOOGL"]

    # Stock names cache (avoids slow info calls)
    STOCK_NAMES = {
        "AAPL": "Apple Inc.",
        "MSFT": "Microsoft Corporation",
        "GOOGL": "Alphabet Inc. Class A",
        "AMZN": "Amazon.com Inc.",
        "NVDA": "NVIDIA Corporation",
        "META": "Meta Platforms Inc.",
        "TSLA": "Tesla Inc.",
        "BRK-B": "Berkshire Hathaway Inc.",
        "UNH": "UnitedHealth Group Inc.",
        "JNJ": "Johnson & Johnson",
        "XOM": "Exxon Mobil Corporation",
        "V": "Visa Inc.",
        "JPM": "JPMorgan Chase & Co.",
        "WMT": "Walmart Inc.",
        "PG": "Procter & Gamble Co.",
        "MA": "Mastercard Inc.",
        "HD": "Home Depot Inc.",
        "CVX": "Chevron Corporation",
        "KO": "Coca-Cola Co.",
        "PFE": "Pfizer Inc.",
        "NFLX": "Netflix Inc.",
        "AMD": "Advanced Micro Devices Inc.",
        "ADBE": "Adobe Inc.",
        "CRM": "Salesforce Inc.",
        "INTC": "Intel Corporation",
    }

    def _get_cached(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry and entry.is_valid():
            return entry.data
        return None

    def _set_cached(self, key: str, data: Any, ttl_seconds: int = 60):
        self._cache[key] = CacheEntry(data, ttl_seconds)

    async def search_tickers(self, query: str) -> List[Dict[str, str]]:
        """Search for tickers using curated list"""
        common_stocks = [
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "MSFT",
                "name": "Microsoft Corporation",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "GOOGL",
                "name": "Alphabet Inc. Class A",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "GOOG",
                "name": "Alphabet Inc. Class C",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "AMZN",
                "name": "Amazon.com Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "NVDA",
                "name": "NVIDIA Corporation",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "META",
                "name": "Meta Platforms Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "TSLA",
                "name": "Tesla Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "BRK-B",
                "name": "Berkshire Hathaway Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "UNH",
                "name": "UnitedHealth Group Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "JNJ",
                "name": "Johnson & Johnson",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "XOM",
                "name": "Exxon Mobil Corporation",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {"symbol": "V", "name": "Visa Inc.", "exchange": "NYSE", "type": "Equity"},
            {
                "symbol": "JPM",
                "name": "JPMorgan Chase & Co.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "WMT",
                "name": "Walmart Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "PG",
                "name": "Procter & Gamble Co.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "MA",
                "name": "Mastercard Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "HD",
                "name": "Home Depot Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "CVX",
                "name": "Chevron Corporation",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "KO",
                "name": "Coca-Cola Co.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "PFE",
                "name": "Pfizer Inc.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "NFLX",
                "name": "Netflix Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "AMD",
                "name": "Advanced Micro Devices Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "ADBE",
                "name": "Adobe Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
        ]

        query_lower = query.lower()
        return [
            stock
            for stock in common_stocks
            if query_lower in stock["symbol"].lower()
            or query_lower in stock["name"].lower()
        ]

    def _fetch_history_sync(self, symbol: str, period: str = "1mo") -> Any:
        """Synchronous history fetch for thread executor"""
        ticker = yf.Ticker(symbol)
        return ticker.history(period=period, interval="1d", prepost=True)

    async def get_stock_data(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Fetch current data for a single stock including sparkline"""
        cache_key = f"stock:{symbol}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        try:
            # Run yfinance in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            hist = await loop.run_in_executor(None, self._fetch_history_sync, symbol)

            if hist.empty or len(hist) == 0:
                return None

            # Get last 7 closing prices for sparkline
            closing_prices = hist["Close"].tolist()
            sparkline = (
                closing_prices[-7:] if len(closing_prices) >= 7 else closing_prices
            )

            # Current price is the latest close (works even when market is closed)
            current_price = hist["Close"].iloc[-1]

            # Previous close for change calculation
            prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price

            change = current_price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0

            result = {
                "symbol": symbol,
                "name": self.STOCK_NAMES.get(symbol, symbol),
                "price": round(float(current_price), 2),
                "change": round(float(change), 2),
                "change_percent": round(float(change_percent), 2),
                "market_cap": None,
                "sparkline": [round(float(p), 2) for p in sparkline],
                "currency": "USD",
            }

            self._set_cached(cache_key, result, ttl_seconds=30)
            return result

        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            return None

    async def get_stocks_batch(self, symbols: List[str]) -> List[Dict[str, Any]]:
        """Fetch data for multiple stocks concurrently"""
        tasks = [self.get_stock_data(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]

    async def get_stock_detail(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get detailed data for a single stock"""
        return await self.get_stock_data(symbol)

    async def get_index_data(self, symbol: str, name: str) -> Dict[str, Any]:
        """Fetch data for a market index"""
        cache_key = f"index:{symbol}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        try:
            loop = asyncio.get_event_loop()
            hist = await loop.run_in_executor(None, self._fetch_history_sync, symbol)

            if hist.empty or len(hist) == 0:
                # Return last known values from cache or zeros
                return {
                    "symbol": symbol,
                    "name": name,
                    "price": 0.0,
                    "change_percent": 0.0,
                }

            current_price = hist["Close"].iloc[-1]
            prev_price = hist["Close"].iloc[-2] if len(hist) > 1 else current_price
            change_percent = (
                ((current_price - prev_price) / prev_price) * 100 if prev_price else 0
            )

            result = {
                "symbol": symbol,
                "name": name,
                "price": round(float(current_price), 2),
                "change_percent": round(float(change_percent), 2),
            }

            self._set_cached(cache_key, result, ttl_seconds=30)
            return result

        except Exception as e:
            print(f"Error fetching index {symbol}: {e}")
            return {"symbol": symbol, "name": name, "price": 0.0, "change_percent": 0.0}

    async def get_market_snapshot(self) -> Dict[str, Any]:
        """Get full market snapshot: indices and top movers"""
        # Check cache first
        cached = self._get_cached("market_snapshot")
        if cached:
            return cached

        # Fetch index data concurrently
        index_tasks = [
            self.get_index_data(symbol, name) for symbol, name in self.INDICES.items()
        ]
        indices = await asyncio.gather(*index_tasks)

        # Fetch top stocks for movers
        top_stocks = await self.get_stocks_batch(self.TOP_SYMBOLS[:10])

        # Sort by absolute change percentage to find movers
        movers = sorted(
            top_stocks, key=lambda x: abs(x.get("change_percent", 0)), reverse=True
        )[:5]

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

        result = {
            "indices": list(indices),
            "top_movers": formatted_movers,
        }

        self._set_cached("market_snapshot", result, ttl_seconds=30)
        return result

    async def get_market_status(self) -> Dict[str, Any]:
        """Calculate market status (open/closed) based on NYSE hours"""
        nyse = pytz.timezone("America/New_York")
        now = datetime.now(nyse)

        is_weekday = now.weekday() < 5
        market_open = time(9, 30)
        market_close = time(16, 0)
        current_time = now.time()

        is_open = is_weekday and market_open <= current_time < market_close

        countdown = ""
        if is_open:
            close_dt = nyse.localize(datetime(now.year, now.month, now.day, 16, 0))
            diff = close_dt - now
            hours = int(diff.total_seconds() // 3600)
            minutes = int((diff.total_seconds() % 3600) // 60)
            countdown = f"{hours}h {minutes}m"
        elif is_weekday and current_time < market_open:
            open_dt = nyse.localize(datetime(now.year, now.month, now.day, 9, 30))
            diff = open_dt - now
            hours = int(diff.total_seconds() // 3600)
            minutes = int((diff.total_seconds() % 3600) // 60)
            countdown = f"{hours}h {minutes}m"

        return {
            "isOpen": is_open,
            "exchange": "NYSE",
            "nextEvent": "close" if is_open else "open",
            "countdown": countdown,
            "openTime": "9:30 AM ET",
            "closeTime": "4:00 PM ET",
        }

    async def get_sector_performance(self) -> List[Dict[str, Any]]:
        """Calculate sector performance from sector ETF prices"""
        cached = self._get_cached("sectors")
        if cached:
            return cached

        async def get_sector_change(
            sector_name: str, etf_symbol: str
        ) -> Dict[str, Any]:
            try:
                loop = asyncio.get_event_loop()
                hist = await loop.run_in_executor(
                    None, self._fetch_history_sync, etf_symbol
                )

                if len(hist) >= 2:
                    current = hist["Close"].iloc[-1]
                    prev = hist["Close"].iloc[-2]
                    change_percent = ((current - prev) / prev) * 100
                else:
                    change_percent = 0.0

                return {
                    "name": sector_name,
                    "change_percent": round(float(change_percent), 2),
                }
            except Exception as e:
                print(f"Error fetching sector {sector_name}: {e}")
                return {"name": sector_name, "change_percent": 0.0}

        tasks = [
            get_sector_change(name, symbol) for name, symbol in self.SECTOR_ETFS.items()
        ]
        results = await asyncio.gather(*tasks)

        self._set_cached("sectors", list(results), ttl_seconds=60)
        return list(results)

    async def get_news(self, limit: int = 6) -> List[Dict[str, Any]]:
        """Fetch news from yfinance for tracked symbols"""
        cached = self._get_cached("news")
        if cached:
            return cached[:limit]

        all_news = []

        for symbol in self.NEWS_SYMBOLS[:3]:
            try:
                ticker = yf.Ticker(symbol)
                news_items = ticker.news or []

                for item in news_items[:2]:
                    pub_time = item.get("providerPublishTime", 0)
                    published_at = (
                        datetime.utcfromtimestamp(pub_time).isoformat() + "Z"
                        if pub_time
                        else ""
                    )

                    all_news.append(
                        {
                            "title": item.get("title", ""),
                            "publisher": item.get("publisher", ""),
                            "link": item.get("link", ""),
                            "published_at": published_at,
                            "related_stocks": [symbol],
                        }
                    )
            except Exception as e:
                print(f"Error fetching news for {symbol}: {e}")

        all_news.sort(key=lambda x: x.get("published_at", ""), reverse=True)
        self._set_cached("news", all_news, ttl_seconds=300)
        return all_news[:limit]

    async def get_analyst_ratings(
        self, symbols: List[str] = None, limit: int = 6
    ) -> List[Dict[str, Any]]:
        """Fetch analyst ratings from yfinance info"""
        if symbols is None:
            symbols = self.TOP_SYMBOLS[:6]

        cached = self._get_cached("ratings")
        if cached:
            return cached[:limit]

        results = []

        for symbol in symbols[:limit]:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info

                rec_key = info.get("recommendationKey", "hold")
                rating_map = {
                    "strong_buy": "buy",
                    "buy": "buy",
                    "hold": "hold",
                    "sell": "sell",
                    "strong_sell": "sell",
                }
                rating = rating_map.get(rec_key, "hold")

                score_map = {"buy": 4.5, "hold": 3.0, "sell": 2.0}
                rating_score = score_map.get(rating, 3.0)

                target_price = (
                    info.get("targetMedianPrice") or info.get("targetMeanPrice") or 0
                )
                current_price = (
                    info.get("currentPrice") or info.get("regularMarketPrice") or 0
                )

                upside = 0.0
                if target_price > 0 and current_price > 0:
                    upside = ((target_price - current_price) / current_price) * 100

                results.append(
                    {
                        "symbol": symbol,
                        "name": self.STOCK_NAMES.get(symbol, symbol),
                        "rating": rating,
                        "rating_score": rating_score,
                        "target_price": round(float(target_price), 2),
                        "current_price": round(float(current_price), 2),
                        "upside_percent": round(float(upside), 2),
                        "analyst_count": info.get("numberOfAnalystOpinions") or 0,
                    }
                )
            except Exception as e:
                print(f"Error fetching ratings for {symbol}: {e}")

        results.sort(key=lambda x: x.get("rating_score", 0), reverse=True)
        self._set_cached("ratings", results, ttl_seconds=300)
        return results[:limit]

    async def get_earnings(self, limit: int = 8) -> List[Dict[str, Any]]:
        """Fetch upcoming earnings dates from yfinance calendar"""
        cached = self._get_cached("earnings")
        if cached:
            return cached[:limit]

        earnings = []

        for symbol in self.TOP_SYMBOLS[:10]:
            try:
                ticker = yf.Ticker(symbol)
                earnings_dates = ticker.earnings_dates

                if earnings_dates is None or earnings_dates.empty:
                    continue

                now = datetime.now()
                upcoming = earnings_dates[earnings_dates.index > now]

                if not upcoming.empty:
                    next_earning = upcoming.iloc[0]
                    earnings_date = upcoming.index[0]

                    earnings.append(
                        {
                            "symbol": symbol,
                            "name": self.STOCK_NAMES.get(symbol, symbol),
                            "date": earnings_date.strftime("%b %d"),
                            "time": "after_market",
                            "expected_eps": next_earning.get("EPS Estimate") or None,
                        }
                    )
            except Exception as e:
                print(f"Error fetching earnings for {symbol}: {e}")

        earnings.sort(
            key=lambda x: (
                datetime.strptime(x["date"], "%b %d") if x["date"] else datetime.max
            )
        )
        self._set_cached("earnings", earnings, ttl_seconds=3600)
        return earnings[:limit]
