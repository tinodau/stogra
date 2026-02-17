# Stogra Master TODO List

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

## 🟡 PHASE 2: UI Shell & Editorial Layout — NEXT

_Focus: Building the "face" of the application using mock data._

> **Status:** Ready to implement. Dependencies: PHASE 1 & PHASE 4 completed.

- [ ] **Global Layout**
  - [ ] Implement `MainLayout` with a 3-column Grid (Editorial Style).
  - [ ] Navbar: Stogra Logo, Search Trigger (Mobile), Theme Toggle.
- [ ] **Hero Section**
  - [ ] Headlines using **Lora** font (Editorial style).
  - [ ] Large centered Search Bar with prominent focus states.
- [ ] **Sidebar Components**
  - [ ] "Top Market Cap" widget (Simple list).
  - [ ] "Daily Movers" widget (Green/Red indicators).
- [ ] **Stock Components**
  - [ ] `StockCard`: Displays Symbol, Name, Price, and % Change.
  - [ ] `SparklineView`: Minimalist chart component (SVG/Canvas).
  - [ ] Skeleton Loaders for all components above.

## 🟠 PHASE 3: Frontend Logic (Mock Data Integration)

_Focus: Making the app functional using simulated data._

- [ ] **Mock Service Layer**
  - [ ] Create `mock-data.ts` containing a variety of US stocks (AAPL, TSLA, NVDA, etc.).
  - [ ] Create API simulation functions with `delay` to test loading states.
- [ ] **State Management**
  - [ ] `useWatchlist` Hook: CRUD logic using **LocalStorage**.
  - [ ] Implement **Search Debouncing** (300ms) in the Hero Search.
- [ ] **Interactivity**
  - [ ] "Add to Watchlist" logic from search results.
  - [ ] "Remove" logic from watchlist.
  - [ ] Theme switching (Sync between System OS and manual toggle).

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
  - [ ] Switch from Mock Data to live API calls using `VITE_API_URL`.
  - [ ] Implement **Polling** (60-second intervals) for automatic price refreshes.
- [ ] **Edge Cases**
  - [ ] Handle "Market Closed" state with visual indicators.
  - [ ] Handle "Empty State" for new users with empty watchlists.
  - [ ] Implement Error Boundaries for API failures.

## 🚀 PHASE 6: Deployment

_Focus: Going live._

- [ ] **Backend Deployment**
  - [ ] Build Docker Image.
  - [ ] Deploy to **Koyeb Tokyo (NRT)**.
- [ ] **Frontend Deployment**
  - [ ] Configure **Cloudflare Pages**.
  - [ ] Setup SSL and Production Environment Variables.

## 📈 PHASE 7: Market Expansion (Future)

- [ ] Multi-currency support (USD/IDR toggle).
- [ ] Integration of global indices (S&P 500, NASDAQ, IDX Composite).
- [ ] Advanced technical indicators for Sparklines.
