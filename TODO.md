# Stogra Master TODO List

## 🎯 Current Focus

**Phase:** 5 - Integration & Polish
**Priority Tasks:**

- Switch from Mock Data to live API @high
- Implement Polling @medium

---

## Legend

| Tag       | Meaning                    |
| --------- | -------------------------- |
| `@high`   | Must complete first        |
| `@medium` | Important but not blocking |
| `@low`    | Nice to have               |
| `→ see:`  | File reference             |

---

## ✅ PHASE 1: Environment & Core Configuration

_Focus: Setting the foundation to prevent technical debt._

- [x] **Project Scaffolding**
  - [x] Initialize Vite + React + TypeScript in the `/client` directory.
  - [x] Setup folder structure per `architecture.md` (api, components, features, hooks, etc.).
- [x] **Design System Implementation**
  - [x] Install Tailwind CSS 4.0.
  - [x] Configure `globals.css` with **OKLCH** variables (Light & Dark mode).
  - [x] Setup Font Face: **Plus Jakarta Sans** (UI), **Lora** (Serif), **IBM Plex Mono** (Data).
  - [x] Configure Tailwind with `@theme` CSS-first configuration.
- [x] **Tooling & DX (Developer Experience)**
  - [x] Setup **ESLint** & **Prettier** (with Tailwind sorting plugin).
  - [x] Setup **TanStack Router** (File-based routing boilerplate).
  - [x] Setup **TanStack Query** (QueryClientProvider & Devtools).

## ✅ PHASE 2: UI Shell & Editorial Layout

_Focus: Building the "face" of the application using mock data._

- [x] **Global Layout**
  - [x] Implemented editorial grid in `App.tsx` (Main + Sidebar columns).
  - [x] Navbar: Stogra Logo, Theme Toggle.
- [x] **Hero Section**
  - [x] Headlines using **Lora** font (Editorial style).
  - [x] Large centered Search Bar with focus states.
- [x] **Sidebar Components**
  - [x] "Top Market Cap" widget (`TopMarketCap.tsx`).
  - [x] "Daily Movers" widget (`DailyMovers.tsx`).
- [x] **Stock Components**
  - [x] `StockCard`: Displays Symbol, Name, Price, % Change, Sparkline.
  - [x] `SparklineView`: Minimalist SVG chart with Teal/Red gradient.
  - [x] Skeleton Loaders (`SkeletonCard`, `SkeletonSidebarItem`).

## ✅ PHASE 3: Frontend Logic (Mock Data Integration)

_Focus: Making the app functional using simulated data._

- [x] **Mock Service Layer**
  - [x] Created `api/mock-data.ts` with 24 US stocks (AAPL, TSLA, NVDA, etc.).
  - [x] API simulation functions with 300-500ms delay for realistic loading.
- [x] **State Management**
  - [x] `useWatchlist` Hook: LocalStorage CRUD + persistence.
  - [x] `useSearch` Hook: 300ms debounce + TanStack Query.
  - [x] `useMarketData` Hook: Polling (60s) + caching.
- [x] **Interactivity**
  - [x] "Add to Watchlist" from search dropdown.
  - [x] "Remove" button on stock cards.
  - [x] Theme switching (Light/Dark/System) with `useTheme` hook.

## 🔵 PHASE 4: Backend Engineering (FastAPI) — COMPLETED

_Focus: Building the data engine to supply the Frontend._

- [x] **Server Initialization**
  - [x] Setup FastAPI in the `/server` directory.
  - [x] Configure **CORS** to allow requests from Cloudflare/Localhost.
- [x] **Service Layer (yfinance)**
  - [x] Integrate `yfinance` for real-time data fetching.
  - [x] Implement logic to transform historical data into **Sparkline** coordinates.
- [x] **API Endpoints**
  - [x] `GET /api/search`: Ticker search endpoint.
  - [x] `GET /api/stocks`: Bulk request for watchlist (Multi-ticker).
  - [x] `GET /api/market/snapshot`: Indices and Movers data for the sidebar.
- [x] **Health & Logging**
  - [x] `/health` endpoint for Koyeb monitoring.
  - [x] Error handling for invalid tickers or API rate limits.

## 🟣 PHASE 5: Integration & Polish

_Focus: Connecting the Frontend to the live Backend._

- [ ] **Data Bridge**
  - [ ] Switch from Mock Data to live API calls using `VITE_API_URL` @high
        → see: `client/src/hooks/useMarketData.ts`
        → see: `client/src/api/mock-data.ts`
  - [ ] Implement **Polling** (60-second intervals) for automatic price refreshes @medium
- [ ] **Edge Cases**
  - [ ] Handle "Market Closed" state with visual indicators @medium
  - [ ] Handle "Empty State" for new users with empty watchlists @low
  - [ ] Implement Error Boundaries for API failures @medium

## 🚀 PHASE 6: Deployment

_Focus: Going live._

- [ ] **Backend Deployment**
  - [ ] Build Docker Image @high
        → see: `server/Dockerfile`
  - [ ] Deploy to **Koyeb Tokyo (NRT)** @high
- [ ] **Frontend Deployment**
  - [ ] Configure **Cloudflare Pages** @high
  - [ ] Setup SSL and Production Environment Variables @medium

## 📈 PHASE 7: Market Expansion (Future)

- [ ] Multi-currency support (USD/IDR toggle) @low
- [ ] Integration of global indices (S&P 500, NASDAQ, IDX Composite) @low
- [ ] Advanced technical indicators for Sparklines @low
