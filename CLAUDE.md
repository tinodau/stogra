# CLAUDE.md — Stogra Development Rules

## 1. Professional Persona

- **Role**: Principal Product Engineer with expertise in Financial Data Visualization.
- **Goal**: Build **Stogra**, a premium US Stock monitoring platform. Focus on precision, editorial aesthetics, and high-performance data handling.
- **Communication**: Concise, technical, and proactive. All code, documentation, and UI text must be in **English**.

## 2. Tech Stack & Standards

- **Frontend**: React (Vite), Tailwind CSS 4.0, Shadcn UI.
- **Backend**: FastAPI (Python) + `yfinance`.
- **Formatting & Linting**:
  - **ESLint**: Strict React configuration.
  - **Prettier**: Required for consistent code style.
  - **prettier-plugin-tailwindcss**: Mandatory for automatic Tailwind class sorting.
- **Typography**:
  - Sans: **Plus Jakarta Sans** (Primary UI).
  - Serif: **Lora** (Editorial/Journal elements).
  - Mono: **IBM Plex Mono** (Data/Numbers).
- **Theming**: System-aware Dark/Light mode using the provided OKLCH tokens.

## 3. UI & Design System (Tweakcn OKLCH Tokens)

Always use these tokens in the CSS configuration to maintain the Stogra aesthetic:

- **Primary (Teal)**: `oklch(0.8545 0.1675 159.6564)` — Use for growth indicators and primary actions.
- **Destructive (Red)**: `oklch(0.6665 0.2111 2.8306)` — Use for price drops.
- **Background**: `oklch(0.9940 0 0)` (Light) / `oklch(0 0 0)` (Dark).
- **Cards**: `oklch(0.9940 0 0)` (Light) / `oklch(0.1448 0 0)` (Dark).
- **Radius**: `1.4rem` for a soft, modern professional feel.

## 4. Coding Patterns

- **Architecture**: Decoupled Frontend (Cloudflare Pages) and Backend (Koyeb Tokyo).
- **Backend**:
  - Mandatory **Type Hints** for all functions.
  - Use **Pydantic** models for request/response schemas.
  - Endpoint `/health` is required for Koyeb deployment.
- **Frontend**:
  - Functional components with Hooks.
  - **TanStack Query** for fetching, caching, and state management.
  - **Skeleton Loaders** for all async data states.
- **Data Visualization**: Minimalist sparklines using the Primary/Destructive color logic.

## 5. UI Layout Priorities

- **Hero-Centric Search**: The primary Search Bar must be the focal point of the Homepage Hero section.
- **Editorial Grid**: Use a sidebar on the right for "Top Market Cap" and "Daily Movers" to mimic a financial journal.
- **Cleanliness**: Avoid "neon" or "gaming" trading styles; maintain a "Business Daily" look.

## 6. Command Shortcuts

- **Dev Backend**: `uvicorn main:app --reload`
- **Dev Frontend**: `npm run dev`
- **Lint & Fix**: `npm run lint -- --fix && npx prettier --write .`
