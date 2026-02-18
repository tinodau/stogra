# Lessons Learned

Session history and learnings for AI context continuity.

---

## 2025-02-18 06:51 UTC: Initial Project Setup

### What Worked

- **Mock-first development**: Building frontend with mock data allowed rapid UI iteration without waiting for backend
- **TanStack Query for all async state**: Eliminated need for global state managers; caching + loading states handled automatically
- **OKLCH color space**: Perceptually uniform colors made dark/light theme toggles look consistent
- **Skeleton loaders from day one**: Better perceived performance than spinners

### What Didn't Work

- **yfinance search limitation**: No native search API - had to use curated stock list for autocomplete
- **Initial routing complexity**: TanStack Router file-based routing added boilerplate for single-page MVP

### API Integration Notes

- yfinance can be slow (1-3s per request for batch queries)
- Rate limiting is undocumented - implement retries with exponential backoff
- `ticker.info` returns different fields for different stocks - always use `.get()` with fallbacks
- Historical data via `ticker.history()` is more reliable than `info` for current price

### UI/UX Decisions

- Hero search bar should be the focal point (PRD requirement)
- Editorial grid (66/33 split) provides journal-like feel
- Sparklines should have no axes/grid for clean aesthetic
- 1.4rem border radius (soft-rect) is the sweet spot for modern feel

---

## 2025-02-18 07:10 UTC: Homepage Enhancement

### What Worked

- **Featured stocks for empty state**: Instead of showing empty watchlist, display trending stocks with "Add to Watchlist" buttons
- **Sector filter tabs**: Quick pill-style buttons for filtering by sector
- **Market status badge**: Real-time indicator in Hero shows market open/closed status
- **Quick stats row**: Mini cards showing S&P 500, Nasdaq, Dow Jones in Hero section

### New Components Created

| Component               | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `FeaturedStocks.tsx`    | Grid of trending stocks with add-to-watchlist buttons |
| `SectorFilter.tsx`      | Pill-style sector filter tabs                         |
| `MarketHours.tsx`       | Market open/closed status with countdown              |
| `SectorPerformance.tsx` | Bar chart showing sector gains/losses                 |
| `Footer.tsx`            | Disclaimer and credits                                |

### Mock Data Extended

Added to `mock-data.ts`:

- `MOCK_MARKET_STATUS` - Market open/closed state
- `MOCK_SECTORS` - Sector performance data
- `MOCK_FEATURED_NEWS` - Featured news item
- `SECTOR_STOCKS` - Mapping of sectors to stock symbols
- Extended `MOCK_STOCK_DATA` with AMD, NFLX, CRM, ADBE, INTC, MA, HD, CVX, KO, PFE, PG

### UI Patterns

- **Conditional rendering**: Show FeaturedStocks when watchlist empty, otherwise show Watchlist
- **Grid layout**: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` for featured stocks
- **Status badge**: Pill with animated pulse dot for open/closed state

---

## 2025-02-18 07:25 UTC: Content Expansion

### What Worked

- **Content sections as separate sections**: Each feature (News, Earnings, Ratings, Dividends) in its own `<section>` with consistent spacing
- **Table layout for Earnings**: Clean table format with date, symbol, time, EPS columns
- **Rating bars**: Visual progress bars showing analyst consensus (1-5 scale)
- **Dividend grid**: 3-column grid showing yield prominently

### New Components Created

| Component              | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `MarketNews.tsx`       | News headlines with sentiment icons           |
| `EarningsCalendar.tsx` | Table of upcoming earnings with EPS estimates |
| `AnalystRatings.tsx`   | Rating bars with price targets and upside %   |
| `DividendStocks.tsx`   | Grid of dividend stocks with yields           |
| `EarningsMini.tsx`     | Compact sidebar version of earnings calendar  |

### New Types Added

```typescript
interface NewsItem {
  title;
  summary;
  source;
  related_stocks;
  sentiment;
  category;
}
interface EarningEvent {
  symbol;
  date;
  time;
  expected_eps;
}
interface AnalystRating {
  symbol;
  rating;
  rating_score;
  target_price;
  upside_percent;
}
interface DividendStock {
  symbol;
  dividend_yield;
  annual_dividend;
  payout_frequency;
}
interface WeekHighLow {
  symbol;
  week_high;
  week_low;
  is_new_high;
  is_new_low;
}
```

### Mock Data Extended

- `MOCK_NEWS` - 6 news items with sentiment and categories
- `MOCK_EARNINGS` - 8 upcoming earnings events
- `MOCK_RATINGS` - 6 analyst ratings with targets
- `MOCK_DIVIDENDS` - 6 dividend stocks with yields
- `MOCK_WEEK_HIGHS` / `MOCK_WEEK_LOWS` - 52-week data

### UI Patterns

- **Section spacing**: `space-y-12` between main content sections
- **Table styling**: `overflow-hidden rounded border` with `thead.bg-muted/50`
- **Rating visualization**: Progress bar with color-coded fill based on rating
- **Category badges**: Color-coded pills for news categories (earnings, market, company, economy)

---

## 2025-02-18 07:45 UTC: Design System Polish

### What Worked

- **Tweakcn color tokens**: Complete OKLCH color scheme with proper contrast ratios
- **Primary color at 65% lightness**: WCAG AA compliant (~4.5:1 contrast) while still vibrant
- **Darker borders (92% lightness)**: Better visibility on white backgrounds
- **Increased shadow opacity**: More visible depth in both light and dark modes

### Design Decisions

| Element      | Light Mode              | Dark Mode                      |
| ------------ | ----------------------- | ------------------------------ |
| Primary text | 65% lightness teal      | 85% lightness teal (unchanged) |
| Border       | 92% lightness (was 97%) | 21% lightness (unchanged)      |
| Shadow-sm    | 8% opacity              | 20% opacity                    |
| Shadow-md    | 12% opacity             | 25% opacity                    |

### Files Modified

- `globals.css` - Updated all color tokens, shadow variables

---

## 2025-02-18 08:00 UTC: Mobile Responsiveness Fix

### Issues Fixed

| Issue                     | Solution                                                       |
| ------------------------- | -------------------------------------------------------------- |
| Horizontal scroll         | Added `overflow-x-hidden` to root div, `min-w-0` to main/aside |
| Inconsistent padding      | Made all containers use `w-full px-4` consistently             |
| Earnings table cramped    | Mobile: card layout with 2-row info, Tablet+: scrollable table |
| Section spacing too large | Reduced `space-y-6` to `space-y-4` on mobile                   |

### Mobile-First Approach

- All components now start with mobile styles, scale up with `sm:`, `md:`, `lg:` breakpoints
- Font sizes, padding, gaps all reduced on mobile
- Tables replaced with card layouts on mobile
- Text truncated with `truncate` class where needed

### Files Modified

- `App.tsx` - Added `overflow-x-hidden`, `min-w-0`, consistent spacing
- `HeroSection.tsx` - Mobile-first headline, stats grid, badge sizing
- `EarningsCalendar.tsx` - Dual layout (mobile cards, tablet+ table)
- `StockCard.tsx` - Reduced sizes, gap fixes
- `FeaturedStocks.tsx` - Mobile grid, smaller text
- `MarketNews.tsx` - Smaller text, tighter spacing
- `AnalystRatings.tsx` - Mobile grid, compact rating labels
- `DividendStocks.tsx` - Mobile grid, reduced padding

---

## 2025-02-18 08:20 UTC: Sparkline Chart Fix

### Issue

The sparkline charts were asymmetrical and "floating" due to:

- Fixed pixel width (`width={96}`) not matching container
- SVG `overflow-visible` causing visual overflow
- No responsive scaling

### Solution

Replaced fixed width with viewBox + responsive container:

```tsx
// Before: fixed width
<svg width={96} height={40}>

// After: viewBox + responsive
<svg viewBox="0 0 100 48" preserveAspectRatio="none">
```

Container now controls size:

```tsx
<div className="h-12 w-24 shrink-0 sm:h-14 sm:w-32">
  <SparklineView ... height={48} />
</div>
```

### Key Changes

| Component            | Change                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `SparklineView.tsx`  | viewBox instead of fixed width, `vectorEffect="non-scaling-stroke"` |
| `StockCard.tsx`      | Proper `h-12 w-24` container with `items-center` alignment          |
| `FeaturedStocks.tsx` | Consistent `h-8 w-16` container sizing                              |

---

## 2025-02-18 08:30 UTC: Stock List Redesign

### Iterations

1. **Sparkline removal** - Charts looked "floating" and asymmetrical, removed for cleaner look
2. **Compact single-line** - Reduced padding, smaller fonts, all info on one line
3. **Table layout** - Fixed column widths for consistent alignment
4. **Final design** - Logo + stacked layout (mobile), fixed widths (desktop)

### Final Layout

**Mobile (stacked):**

```
●  NVDA              $726.13   +2.44%   ×
   NVIDIA Corp
```

**Desktop (fixed widths):**

```
●  NVDA   NVIDIA Corp   $726.13   +2.44%   ×
```

### Component Changes

| Old Component        | New Component   | Change                   |
| -------------------- | --------------- | ------------------------ |
| `StockCard.tsx`      | `StockList.tsx` | Merged into unified list |
| `FeaturedStocks.tsx` | `StockList.tsx` | Replaced by unified list |

### Column Widths (Desktop)

| Column  | Width    |
| ------- | -------- |
| Logo    | `w-8`    |
| Ticker  | `w-14`   |
| Company | `flex-1` |
| Price   | `w-24`   |
| Change  | `w-20`   |

---

## Session Log

| Datetime             | Focus                   | Key Outcome                                                                 |
| -------------------- | ----------------------- | --------------------------------------------------------------------------- |
| 2025-02-18 06:51 UTC | Project exploration     | Documented architecture, identified Phase 5-6 blockers                      |
| 2025-02-18 06:55 UTC | Workflow improvements   | Added TODO priority tags, session workflow, file reference conventions      |
| 2025-02-18 07:00 UTC | ESLint migration        | Migrated from `.eslintrc.json` to `eslint.config.js` (ESLint 9 flat config) |
| 2025-02-18 07:10 UTC | Homepage enhancement    | Added Hero stats, FeaturedStocks, SectorFilter, MarketHours, Footer         |
| 2025-02-18 07:25 UTC | Content expansion       | Added MarketNews, EarningsCalendar, AnalystRatings, DividendStocks          |
| 2025-02-18 07:35 UTC | AnalystRatings refactor | Converted to compact 3-column grid layout                                   |
| 2025-02-18 07:45 UTC | Design system polish    | Tweakcn colors, primary contrast fix, border/shadow visibility              |
| 2025-02-18 08:00 UTC | Mobile responsiveness   | Fixed horizontal scroll, consistent spacing, mobile-first all components    |
| 2025-02-18 08:15 UTC | Hero/AnalystRatings fix | Centered indices, 2-column ratings grid                                     |
| 2025-02-18 08:20 UTC | Sparkline fix           | Responsive viewBox, proper container sizing, consistent heights             |
| 2025-02-18 08:30 UTC | Stock list redesign     | Removed sparklines, table layout, logo + stacked mobile layout              |
| 2025-02-18 08:45 UTC | yfinance adaptation     | Adapted types to yfinance capabilities, updated news/ratings structure      |

---

## 2025-02-18 08:45 UTC: yfinance Data Adaptation

### Goal

Adapt mock data types to match yfinance capabilities.

### Changes Made

**NewsItem type:**

- Removed: `id`, `summary`, `sentiment`, `category`
- Added: `link`
- Renamed: `source` → `publisher`

**AnalystRating.rating:**

- Removed: `strong_buy`, `strong_sell`
- Kept: `buy`, `hold`, `sell` (yfinance only provides these)

### yfinance Data Sources

| Data               | yfinance Method                                          |
| ------------------ | -------------------------------------------------------- |
| News               | `ticker.news`                                            |
| Sector Performance | Sector ETFs (XLK, XLF, XLE, XLV, XLP)                    |
| Market Status      | Calculate from NYSE hours                                |
| Analyst Ratings    | `info["recommendationKey"]`, `info["targetMedianPrice"]` |
| Earnings           | `ticker.earnings_dates`                                  |

### Server Files Updated

- `server/app/services/market_data.py` - Added new methods
- `server/app/main.py` - Added new API routes

### Client Files Updated

- `client/src/types/index.ts` - Updated types
- `client/src/api/mock-data.ts` - Updated mock data
- `client/src/components/MarketNews.tsx` - Removed sentiment/category
- `client/src/components/AnalystRatings.tsx` - Simplified rating labels

---

## To Update This File

After each significant session, add:

1. **Datetime** (ISO format: `YYYY-MM-DD HH:MM UTC`)
2. Focus area
3. What worked / didn't work
4. Any API quirks or edge cases discovered
5. UI decisions made iteratively
