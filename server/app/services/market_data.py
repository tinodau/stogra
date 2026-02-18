"""
Market Data Service - yfinance integration layer
Handles all interactions with Yahoo Finance API
"""

import asyncio
from datetime import datetime, time
from typing import List, Dict, Any
import yfinance as yf
import pytz


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

    async def search_tickers(self, query: str) -> List[Dict[str, str]]:
        """
        Search for tickers using yfinance
        Note: yfinance doesn't have a direct search API, so we use a curated list
        for common US equities
        """
        # Common US stocks for demo (in production, use a comprehensive dataset)
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
                "symbol": "MRK",
                "name": "Merck & Co.",
                "exchange": "NYSE",
                "type": "Equity",
            },
            {
                "symbol": "CSCO",
                "name": "Cisco Systems Inc.",
                "exchange": "NASDAQ",
                "type": "Equity",
            },
            {
                "symbol": "NFLX",
                "name": "Netflix Inc.",
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
        results = [
            stock
            for stock in common_stocks
            if query_lower in stock["symbol"].lower()
            or query_lower in stock["name"].lower()
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
            sparkline = (
                closing_prices[-7:] if len(closing_prices) >= 7 else closing_prices
            )

            # Current price and change
            current_price = hist["Close"].iloc[-1]
            prev_close = (
                info.get("regularMarketPreviousClose") or hist["Close"].iloc[-2]
                if len(hist) > 1
                else current_price
            )
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
            self.get_index_data(symbol, name) for symbol, name in self.INDICES.items()
        ]
        indices = await asyncio.gather(*index_tasks)

        # Fetch top stocks for movers
        top_stocks = await self.get_stocks_batch(self.TOP_SYMBOLS[:15])

        # Sort by absolute change percentage to find movers
        movers = sorted(
            top_stocks, key=lambda x: abs(x.get("change_percent", 0)), reverse=True
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

    async def get_market_status(self) -> Dict[str, Any]:
        """
        Calculate market status (open/closed) based on NYSE hours
        NYSE: 9:30 AM - 4:00 PM ET, Mon-Fri
        """
        nyse = pytz.timezone("America/New_York")
        now = datetime.now(nyse)

        # Check if weekday (0-4 = Mon-Fri)
        is_weekday = now.weekday() < 5

        # Check if within trading hours
        market_open = time(9, 30)
        market_close = time(16, 0)
        current_time = now.time()

        is_open = is_weekday and market_open <= current_time < market_close

        # Calculate countdown
        countdown = ""
        if is_open:
            # Time until close
            close_dt = nyse.localize(datetime(now.year, now.month, now.day, 16, 0))
            diff = close_dt - now
            hours = int(diff.total_seconds() // 3600)
            minutes = int((diff.total_seconds() % 3600) // 60)
            countdown = f"{hours}h {minutes}m"
        elif is_weekday and current_time < market_open:
            # Time until open
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
        """
        Calculate sector performance from sector ETF prices
        """
        results = []

        async def get_sector_change(
            sector_name: str, etf_symbol: str
        ) -> Dict[str, Any]:
            try:
                ticker = yf.Ticker(etf_symbol)
                hist = ticker.history(period="2d", interval="1d")

                if len(hist) >= 2:
                    current = hist["Close"].iloc[-1]
                    prev = hist["Close"].iloc[-2]
                    change_percent = ((current - prev) / prev) * 100
                else:
                    change_percent = 0.0

                return {"name": sector_name, "change_percent": round(change_percent, 2)}
            except Exception as e:
                print(f"Error fetching sector {sector_name}: {e}")
                return {"name": sector_name, "change_percent": 0.0}

        tasks = [
            get_sector_change(name, symbol) for name, symbol in self.SECTOR_ETFS.items()
        ]
        results = await asyncio.gather(*tasks)
        return list(results)

    async def get_news(self, limit: int = 6) -> List[Dict[str, Any]]:
        """
        Fetch news from yfinance for tracked symbols
        """
        all_news = []

        for symbol in self.NEWS_SYMBOLS[:3]:  # Limit to avoid too many requests
            try:
                ticker = yf.Ticker(symbol)
                news_items = ticker.news or []

                for item in news_items[:2]:  # Max 2 per symbol
                    # Convert timestamp to ISO string
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

        # Sort by published_at (newest first) and limit
        all_news.sort(key=lambda x: x.get("published_at", ""), reverse=True)
        return all_news[:limit]

    async def get_analyst_ratings(
        self, symbols: List[str] = None, limit: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Fetch analyst ratings from yfinance info
        """
        if symbols is None:
            symbols = self.TOP_SYMBOLS[:6]

        results = []

        for symbol in symbols[:limit]:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info

                # Map yfinance recommendationKey to our rating
                rec_key = info.get("recommendationKey", "hold")
                # yfinance only returns: buy, hold, sell
                rating_map = {
                    "strong_buy": "buy",
                    "buy": "buy",
                    "hold": "hold",
                    "sell": "sell",
                    "strong_sell": "sell",
                }
                rating = rating_map.get(rec_key, "hold")

                # Rating score (1-5 scale)
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
                        "name": info.get("longName") or info.get("shortName") or symbol,
                        "rating": rating,
                        "rating_score": rating_score,
                        "target_price": round(target_price, 2),
                        "current_price": round(current_price, 2),
                        "upside_percent": round(upside, 2),
                        "analyst_count": info.get("numberOfAnalystOpinions") or 0,
                    }
                )
            except Exception as e:
                print(f"Error fetching ratings for {symbol}: {e}")

        # Sort by rating_score (best first)
        results.sort(key=lambda x: x.get("rating_score", 0), reverse=True)
        return results[:limit]

    async def get_earnings(self, limit: int = 8) -> List[Dict[str, Any]]:
        """
        Fetch upcoming earnings dates from yfinance calendar
        """
        earnings = []

        for symbol in self.TOP_SYMBOLS[:10]:
            try:
                ticker = yf.Ticker(symbol)

                # Get earnings dates
                earnings_dates = ticker.earnings_dates
                if earnings_dates is None or earnings_dates.empty:
                    continue

                # Get upcoming earnings (future dates)
                now = datetime.now()
                upcoming = earnings_dates[earnings_dates.index > now]

                if not upcoming.empty:
                    next_earning = upcoming.iloc[0]
                    earnings_date = upcoming.index[0]

                    # Determine time (before/after market)
                    # yfinance doesn't provide this, default to after_market
                    earnings_time = "after_market"

                    earnings.append(
                        {
                            "symbol": symbol,
                            "name": ticker.info.get("longName")
                            or ticker.info.get("shortName")
                            or symbol,
                            "date": earnings_date.strftime("%b %d"),
                            "time": earnings_time,
                            "expected_eps": next_earning.get("EPS Estimate") or None,
                        }
                    )
            except Exception as e:
                print(f"Error fetching earnings for {symbol}: {e}")

        # Sort by date
        earnings.sort(
            key=lambda x: (
                datetime.strptime(x["date"], "%b %d") if x["date"] else datetime.max
            )
        )
        return earnings[:limit]
