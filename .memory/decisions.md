# Architecture Decision Records (ADR)

Key technical decisions and their rationale.

---

## ADR-001: Decoupled Client-Server Architecture

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
Frontend needs to be fast globally, backend needs to be close to data source for latency.

**Decision:**
- Frontend: Cloudflare Pages (global edge network)
- Backend: Koyeb Tokyo region (APAC optimization)

**Rationale:**
- Cloudflare's edge network serves static assets from 300+ locations
- Tokyo (NRT) provides <100ms latency for Southeast Asian users
- Decoupled deployment allows independent scaling and updates

**Consequences:**
- CORS configuration required for cross-origin requests
- Environment variables needed for API URL management
- No server-side rendering (CSR only)

---

## ADR-002: LocalStorage for Watchlist (Phase 1)

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
MVP needs user persistence without authentication complexity.

**Decision:**
Use browser LocalStorage for watchlist data, no backend database.

**Rationale:**
- Zero friction: users can start using app immediately
- No auth flow needed for Phase 1
- Reduces infrastructure complexity
- Sufficient for single-device usage

**Consequences:**
- Data doesn't sync across devices
- Data lost if user clears browser storage
- Future Phase 2: Add Google OAuth + cloud storage

---

## ADR-003: OKLCH Color Space

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
Need consistent colors across light/dark themes without "neon trading app" aesthetic.

**Decision:**
Use OKLCH color space for all theme colors via CSS variables.

**Rationale:**
- Perceptually uniform: colors look equally bright across hue changes
- Better gradient interpolation than HSL
- Primary (teal) and Destructive (red) stay consistent in both themes
- Avoids "gaming RGB" look of traditional trading platforms

**Consequences:**
- Requires modern browser support (Safari 15.4+)
- CSS variables: `oklch(L C H)` format

---

## ADR-004: Mock Data First Development

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
Need to iterate on UI before backend is fully deployed.

**Decision:**
Build frontend with `mock-data.ts` service layer, swap to real API later.

**Rationale:**
- 300-500ms simulated delay matches expected backend latency
- Allows parallel frontend/backend development
- Easier testing without external dependencies
- Single file to swap when going live

**Consequences:**
- Must maintain mock types in sync with API contract
- Phase 5: Replace `mockApi` calls with real fetch

---

## ADR-005: TanStack Query Over Redux

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
Need state management for async server data.

**Decision:**
Use TanStack Query for all server state. No global state manager.

**Rationale:**
- Handles caching, de-duplication, background refetching automatically
- Built-in loading/error states
- Eliminates boilerplate of actions/reducers
- LocalStorage watchlist is the only client state (useWatchlist hook)

**Consequences:**
- Query keys must be consistent (see patterns.md)
- staleTime/refetchInterval must be configured per endpoint

---

## ADR-006: yfinance as Data Provider

**Date:** 2025-02-18 06:51 UTC
**Status:** Accepted

**Context:**
Need free, reliable stock data for MVP without paid API subscriptions.

**Decision:**
Use yfinance Python library for all market data.

**Rationale:**
- Free and well-maintained
- Covers US equities comprehensively
- Includes historical data for sparklines
- No API key required

**Consequences:**
- Rate limiting is undocumented (implement retries)
- Search functionality limited (curated list used)
- Real-time data has ~15 min delay for free tier
- Future Phase 2: Consider paid API for real-time data
