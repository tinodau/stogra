# Product Requirements Document: Stogra

## 1. Project Vision & Objective

**Stogra** (Stock Graphic) is a high-performance, professional-grade digital journal for monitoring equity markets. It combines the minimalist aesthetic of traditional financial broadsheets with modern data visualization. The goal is to provide a clean, "noise-free" environment for tracking US market performance.

## 2. Target Audience

- Professional investors and market enthusiasts requiring a streamlined, editorial-style stock interface.
- Users looking for a high-readability alternative to cluttered brokerage dashboards.

## 3. Core Features (Phase 1 - MVP)

- **US Market Focus**: Full integration for US Equity markets via `yfinance`.
- **Primary Search Interface**: A prominent, hero-positioned search bar for instant ticker lookups.
- **Local Watchlist**: Client-side persistence using **LocalStorage** for ticker tracking without account overhead.
- **Market Indices**: Real-time snapshot of major US indices (S&P 500, Nasdaq-100, Dow Jones).
- **Interactive Sparklines**: Minimalist price-over-time visualizations for all tracked stocks.
- **System Health Monitor**: A backend connectivity status indicator for the Koyeb API.

## 4. UX & Design System

### 4.1 Visual Identity

- **Branding**: Stogra — focused, analytical, and graphic-centric.
- **Typography**: **Geist** sans-serif family for a modern, engineering-precise feel.
- **Theme Support**: Full **Dark Mode** and **Light Mode** compatibility.
- **Color Palette**:
  - **Primary Accents**: Teal / Emerald Green for growth and primary actions.
  - **Neutrals**: Deep Navy and Charcoal for structural elements (Dark Mode) / Soft Off-white and Light Grey (Light Mode).

## 5. Homepage Layout Specification

The homepage is designed to drive immediate user intent:

- **Navbar**: Minimalist design. Contains the Stogra logo, Navigation links (Markets, Sectors, About), and a **Theme Toggle** (Light/Dark).
- **Hero Section**:
  - **Headline**: Impactful market summary.
  - **Primary Search**: A large, centered Search Bar to emphasize the "Stock Graphic" lookup intent.
- **Main Content (Left Column)**:
  - **Dynamic Watchlist**: User-added tickers displayed in a professional table/list format.
  - **Category Filters**: Categorization (e.g., Tech, Mega Cap, ETFs) to refine view.
- **Sidebar (Right Column)**:
  - **Top Market Cap**: A curated list of the top 10 US companies by valuation.
  - **Daily Movers**: Brief list of the highest volatility tickers of the session.
- **Footer**: Standard professional footer with disclaimer, tech stack, and roadmap links.

## 6. Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Geist Font.
- **Backend**: FastAPI (Python), `yfinance`.
- **Deployment**:
  - Frontend: **Cloudflare Pages**.
  - Backend: **Koyeb (Tokyo Region)**.
- **Storage**: Browser LocalStorage.

## 7. Non-Goals (Future Phases)

- **Indonesian Market (IDX)**: Planned for Phase 2.
- **Cryptocurrency**: Planned for Phase 2.
- **User Authentication**: Persistent cloud storage and Google OAuth.
- **Advanced Technical Indicators**: MACD, Bollinger Bands, etc.
