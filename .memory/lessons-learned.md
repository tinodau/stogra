# Lessons Learned

Session history and learnings for AI context continuity.

---

## 2025-02-18: Initial Project Setup

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

## Session Log

| Date | Focus | Key Outcome |
|------|-------|-------------|
| 2025-02-18 | Project exploration | Documented architecture, identified Phase 5-6 blockers |

---

## To Update This File

After each significant session, add:
1. Date and focus area
2. What worked / didn't work
3. Any API quirks or edge cases discovered
4. UI decisions made iteratively
