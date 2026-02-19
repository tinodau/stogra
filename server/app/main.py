"""
Stogra - Stock Graphic API
FastAPI backend for US equity market data via yfinance
"""

from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.services.market_data import MarketDataService


# Pydantic Schemas (matching API Contract)
class SearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str
    type: str


class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    market_cap: int | None
    sparkline: List[float]
    currency: str


class IndexSnapshot(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float


class MoverStock(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float


class MarketSnapshot(BaseModel):
    indices: List[IndexSnapshot]
    top_movers: List[MoverStock]


class MarketStatus(BaseModel):
    isOpen: bool
    exchange: str
    nextEvent: str
    countdown: str
    openTime: str
    closeTime: str


class Sector(BaseModel):
    name: str
    change_percent: float


class NewsItem(BaseModel):
    title: str
    publisher: str
    link: str
    published_at: str
    related_stocks: List[str]


class AnalystRating(BaseModel):
    symbol: str
    name: str
    rating: str
    rating_score: float
    target_price: float
    current_price: float
    upside_percent: float
    analyst_count: int


class EarningEvent(BaseModel):
    symbol: str
    name: str
    date: str
    time: str
    expected_eps: float | None


class DividendStock(BaseModel):
    symbol: str
    name: str
    price: float
    dividend_yield: float
    annual_dividend: float
    payout_frequency: str
    ex_dividend_date: str


class FeaturedNews(BaseModel):
    title: str
    symbol: str
    summary: str


class WeekHighLow(BaseModel):
    symbol: str
    name: str
    price: float
    week_high: float
    week_low: float
    percent_from_high: float
    is_new_high: bool
    is_new_low: bool


class HealthStatus(BaseModel):
    status: str
    version: str


# Service instance (singleton pattern)
market_service = MarketDataService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - startup/shutdown logic"""
    # Startup
    print("🚀 Stogra API starting up...")
    yield
    # Shutdown
    print("👋 Stogra API shutting down...")


# FastAPI Application
app = FastAPI(
    title="Stogra API",
    description="US Equity Market Data API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthStatus)
async def health_check() -> HealthStatus:
    """
    Health check endpoint for Koyeb deployment monitoring
    """
    return HealthStatus(status="operational", version="1.0.0")


@app.get("/api/search", response_model=List[SearchResult])
async def search_tickers(
    q: str = Query(..., min_length=1, max_length=50),
) -> List[SearchResult]:
    """
    Search for stock tickers by company name or symbol
    - Debounce on frontend: 300ms
    - Max results: 5
    """
    try:
        results = await market_service.search_tickers(q)
        return results[:5]  # Limit to 5 results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@app.get("/api/stocks", response_model=List[StockData])
async def get_stocks(
    symbols: str = Query(
        ..., description="Comma-separated stock symbols e.g., AAPL,TSLA,MSFT"
    ),
) -> List[StockData]:
    """
    Fetch data for multiple stocks including sparkline data
    - Supports concurrent fetching via asyncio.gather
    """
    symbol_list = [s.strip().upper() for s in symbols.split(",")]

    if not symbol_list:
        raise HTTPException(status_code=400, detail="No symbols provided")

    try:
        stocks = await market_service.get_stocks_batch(symbol_list)
        return stocks
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch stock data: {str(e)}"
        )


@app.get("/api/market/snapshot", response_model=MarketSnapshot)
async def get_market_snapshot() -> MarketSnapshot:
    """
    Get current market snapshot including major indices and top movers
    """
    try:
        snapshot = await market_service.get_market_snapshot()
        return snapshot
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch market snapshot: {str(e)}"
        )


@app.get("/api/stocks/{symbol}", response_model=StockData)
async def get_stock_detail(symbol: str) -> StockData:
    """
    Get detailed data for a single stock (optional Phase 1 feature)
    """
    try:
        stock = await market_service.get_stock_detail(symbol.upper())
        if not stock:
            raise HTTPException(status_code=404, detail=f"Ticker '{symbol}' not found")
        return stock
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch stock detail: {str(e)}"
        )


@app.get("/api/market/status", response_model=MarketStatus)
async def get_market_status() -> MarketStatus:
    """
    Get current market status (open/closed) based on NYSE hours
    """
    try:
        status = await market_service.get_market_status()
        return status
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch market status: {str(e)}"
        )


@app.get("/api/market/sectors", response_model=List[Sector])
async def get_sector_performance() -> List[Sector]:
    """
    Get sector performance calculated from sector ETFs
    """
    try:
        sectors = await market_service.get_sector_performance()
        return sectors
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch sector performance: {str(e)}"
        )


@app.get("/api/market/news", response_model=List[NewsItem])
async def get_news(limit: int = Query(6, ge=1, le=20)) -> List[NewsItem]:
    """
    Get market news from yfinance
    """
    try:
        news = await market_service.get_news(limit)
        return news
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")


@app.get("/api/market/ratings", response_model=List[AnalystRating])
async def get_analyst_ratings(
    limit: int = Query(6, ge=1, le=20),
) -> List[AnalystRating]:
    """
    Get analyst ratings and price targets
    """
    try:
        ratings = await market_service.get_analyst_ratings(limit=limit)
        return ratings
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch analyst ratings: {str(e)}"
        )


@app.get("/api/market/earnings", response_model=List[EarningEvent])
async def get_earnings(limit: int = Query(8, ge=1, le=20)) -> List[EarningEvent]:
    """
    Get upcoming earnings calendar
    """
    try:
        earnings = await market_service.get_earnings(limit)
        return earnings
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch earnings: {str(e)}"
        )


@app.get("/api/market/dividends", response_model=List[DividendStock])
async def get_dividend_stocks(
    limit: int = Query(6, ge=1, le=20),
) -> List[DividendStock]:
    """
    Get dividend-paying stocks sorted by yield
    """
    try:
        dividends = await market_service.get_dividend_stocks(limit)
        return dividends
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch dividend stocks: {str(e)}"
        )


@app.get("/api/market/news/featured", response_model=FeaturedNews)
async def get_featured_news() -> FeaturedNews:
    """
    Get featured news story
    """
    try:
        featured = await market_service.get_featured_news()
        return featured
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch featured news: {str(e)}"
        )


@app.get("/api/market/week-highs-lows")
async def get_week_highs_lows():
    """
    Get 52-week highs and lows
    """
    try:
        data = await market_service.get_week_highs_lows()
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch week highs/lows: {str(e)}"
        )
