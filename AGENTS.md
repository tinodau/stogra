# AGENTS.md — Unified AI Rules for Stogra

This file provides context and rules for all AI assistants (Claude, Cursor, GitHub Copilot, etc.) working on the Stogra codebase.

---

## 1. Project Overview

**Stogra** is a professional US stock monitoring platform with an editorial "financial journal" aesthetic. It combines minimalist design with real-time market data visualization.

- **Live Status**: Phase 4 complete (backend ready). Phase 5-6 pending (integration + deployment).
- **Architecture**: Decoupled frontend (Cloudflare Pages) and backend (Koyeb Tokyo).
- **Memory Files**: See `.memory/` directory for session history, decisions, and patterns.

---

## 2. Tech Stack

### Frontend (`client/`)

| Component   | Choice              |
| ----------- | ------------------- |
| Framework   | React 19 + Vite     |
| Language    | TypeScript (strict) |
| Styling     | Tailwind CSS 4.0    |
| UI Library  | Shadcn UI           |
| State/Fetch | TanStack Query      |
| Routing     | TanStack Router     |

### Backend (`server/`)

| Component     | Choice       |
| ------------- | ------------ |
| Framework     | FastAPI      |
| Language      | Python 3.11+ |
| Data Provider | yfinance     |
| Validation    | Pydantic v2  |
| Server        | Uvicorn      |

---

## 3. Design System

### Typography (3-font system)

- **Sans**: `Plus Jakarta Sans` — UI, buttons, labels
- **Serif**: `Lora` — Headlines, editorial text
- **Mono**: `IBM Plex Mono` — Numbers, prices, data

### OKLCH Colors (CSS Variables)

| Token           | Light Mode                      | Dark Mode                     |
| --------------- | ------------------------------- | ----------------------------- |
| `--background`  | `oklch(0.9940 0 0)`             | `oklch(0 0 0)`                |
| `--foreground`  | `oklch(0 0 0)`                  | `oklch(0.9551 0 0)`           |
| `--card`        | `oklch(0.9940 0 0)`             | `oklch(0.1448 0 0)`           |
| `--primary`     | `oklch(0.8545 0.1675 159.6564)` | Same (Teal)                   |
| `--destructive` | `oklch(0.6665 0.2111 2.8306)`   | `oklch(0.7425 0.1696 1.0847)` |
| `--radius`      | `1.4rem`                        | `1.4rem`                      |

### Color Logic

- **Teal (primary)**: Growth, positive change, primary actions
- **Red (destructive)**: Loss, negative change, destructive actions

---

## 4. Coding Rules

### General

- **All code and documentation in English**.
- **No comments unless requested** — code should be self-documenting.
- **Type safety is mandatory** — strict TypeScript, Pydantic schemas.
- **Follow existing patterns** — check neighboring files before adding new code.
- **Always run lint and format after edits**:
  ```bash
  cd client && npm run lint -- --fix && npm run format
  ```

### Frontend

- Functional components with hooks.
- TanStack Query for all async state (no Redux/Zustand).
- Skeleton loaders for all async data states.
- Import types separately: `import type { X } from "@/types";`
- Use CSS variables for theming, not hardcoded colors.

### Backend

- Type hints required for all functions.
- Pydantic models for all request/response schemas.
- Async/await for all I/O operations.
- Graceful error handling — log and return None/empty, don't crash.

---

## 5. Project Structure

```
stogra/
├── .memory/              # AI context files
│   ├── lessons-learned.md
│   ├── decisions.md
│   └── patterns.md
├── .docs/                # Documentation
├── client/               # Frontend (Vite + React)
│   ├── src/
│   │   ├── api/          # Mock API layer
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom hooks
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # CSS variables
│   └── package.json
├── server/               # Backend (FastAPI)
│   ├── app/
│   │   ├── api/          # Route definitions
│   │   ├── core/         # Config, logging
│   │   ├── schemas/      # Pydantic models
│   │   ├── services/     # Business logic
│   │   └── main.py       # Entry point
│   └── requirements.txt
├── AGENTS.md             # This file
├── CLAUDE.md             # Claude-specific rules (legacy)
├── PRD.md                # Product requirements
└── TODO.md               # Roadmap
```

---

## 6. Common Commands

### Development

```bash
# Frontend
cd client && npm run dev

# Backend
cd server && uvicorn app.main:app --reload
```

### Linting & Formatting

```bash
# Frontend
cd client && npm run lint -- --fix && npm run format
```

### Build

```bash
# Frontend
cd client && npm run build

# Backend (Docker)
cd server && docker build -t stogra-api .
```

---

## 7. API Endpoints

| Endpoint                    | Method | Description            |
| --------------------------- | ------ | ---------------------- |
| `/health`                   | GET    | Health check for Koyeb |
| `/api/search?q={query}`     | GET    | Search tickers         |
| `/api/stocks?symbols={csv}` | GET    | Get stock data (batch) |
| `/api/market/snapshot`      | GET    | Indices + top movers   |
| `/api/stocks/{symbol}`      | GET    | Single stock detail    |

---

## 8. Current Priorities

From `TODO.md`:

1. **Phase 5**: Connect frontend to live backend API
2. **Phase 6**: Deploy to Cloudflare Pages + Koyeb Tokyo
3. Handle edge cases (market closed, empty states, error boundaries)

---

## 9. Files to Read First

When starting a new session:

1. `TODO.md` — Current status and blockers
2. `.memory/lessons-learned.md` — Recent learnings
3. `.memory/patterns.md` — Code conventions
4. `.docs/api-contract.md` — API interface

---

## 10. Memory Files Maintenance

**Important:** Always update `.memory/` files when:

- Completing significant work → Update `lessons-learned.md`
- Making architecture decisions → Add ADR to `decisions.md`
- Establishing new code patterns → Update `patterns.md`

**Format:** Use datetime in ISO format: `YYYY-MM-DD HH:MM UTC`

---

## 11. Session Workflow

### Start of Session

1. Read `TODO.md` — check current focus and blockers
2. Read `.memory/lessons-learned.md` — recent context
3. Pick next task from TODO.md (prioritize `@high` tasks)

### During Session

- Reference files using: `file.ts:42` or `→ see: file.ts`
- Follow patterns from `.memory/patterns.md`

### End of Session

1. **Update `TODO.md`** — mark completed tasks, update Current Focus
2. **Update `.memory/lessons-learned.md`** — add session entry with datetime
3. **Update `.memory/patterns.md`** — if new patterns established
4. **Update `.docs/`** — if API contract or architecture changed

### File Reference Convention

| Format           | Usage                  |
| ---------------- | ---------------------- |
| `file.ts:42`     | Specific line number   |
| `file.ts:10-25`  | Line range             |
| `→ see: file.ts` | Doc reference          |
| `#PHASE-5`       | TODO section reference |

---

## 12. Priority Tags

| Tag       | Meaning             | Action                     |
| --------- | ------------------- | -------------------------- |
| `@high`   | Blocking / Critical | Complete first             |
| `@medium` | Important           | Complete after @high       |
| `@low`    | Nice to have        | Complete when time permits |
