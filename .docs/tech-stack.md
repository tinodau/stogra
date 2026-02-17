# Technology Stack & Architecture Decisions

## 1. Frontend Ecosystem

Built for speed, type safety, and editorial precision.

| Component       | Choice                 | Rationale                                                                                                           |
| :-------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Framework**   | **React 19**           | Leveraging the latest concurrent features and compiler optimizations.                                               |
| **Build Tool**  | **Vite**               | Instant server start and HMR (Hot Module Replacement) for rapid UI iteration.                                       |
| **Language**    | **TypeScript**         | Strict type safety to prevent runtime errors, essential for financial data handling.                                |
| **Styling**     | **Tailwind CSS 4.0**   | Zero-runtime overhead. Using v4.0 for the new engine and simplified configuration.                                  |
| **UI Library**  | **Shadcn UI**          | Headless, accessible components that we fully customize to match the "Journal" aesthetic.                           |
| **State/Fetch** | **TanStack Query**     | Handles caching, de-duping requests, and loading states automatically. Replaces global state managers for API data. |
| **Routing**     | **Tanstack Router v6** | Client-side routing for seamless navigation between Market and Sector views.                                        |

## 2. Backend Ecosystem

Built for asynchronous performance and easy data integration.

| Component         | Choice           | Rationale                                                                                                                  |
| :---------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | **FastAPI**      | High-performance Python framework. Native async support handles multiple `yfinance` requests efficiently.                  |
| **Language**      | **Python 3.11+** | The standard for financial analysis and data science.                                                                      |
| **Data Provider** | **yfinance**     | Robust library for fetching real-time market data without expensive API subscriptions (MVP Phase).                         |
| **Validation**    | **Pydantic v2**  | Enforces strict schema validation for all incoming and outgoing data, ensuring the Frontend never receives malformed JSON. |
| **Server**        | **Uvicorn**      | Lightning-fast ASGI server implementation.                                                                                 |

## 3. Infrastructure & Deployment

Optimized for latency and developer experience.

- **Backend Hosting**: **Koyeb (Tokyo Region)**
  - _Why Tokyo?_ While the data is US-based, placing the server in Tokyo reduces latency for users in Southeast Asia (Indonesia), providing a snappier experience than US-based servers.
  - _Deployment:_ Docker-based containerization.

- **Frontend Hosting**: **Cloudflare Pages**
  - _Why?_ Global Edge Network ensures the UI loads instantly anywhere. Seamless integration with GitHub for CI/CD.

- **Storage**: **LocalStorage** (Phase 1)
  - _Why?_ Eliminates the need for a database and authentication for the MVP, allowing immediate user utility with zero friction.

## 4. Design System & Assets

The "Stogra" aesthetic relies on specific choices to differentiate it from generic trading apps.

- **Color Space**: **OKLCH**
  - Using the perceptually uniform OKLCH color space allows for vibrant, accessible gradients and distinct "Teal" vs "Red" indicators that don't look neon/cheap.
- **Typography**:
  - **Interface**: `Plus Jakarta Sans` (Modern, geometric, readable).
  - **Editorial**: `Lora` (Serif, used for headers/news to evoke the "Journal" feel).
  - **Data**: `IBM Plex Mono` (Monospaced, ensures numbers in tables align perfectly).

- **Iconography**: **Lucide React**
  - Clean, consistent stroke width icons that blend well with text.

## 5. Development Tools

- **Linting**: ESLint + Prettier (Strict configuration).
- **Package Manager**: npm (Standard stability).
- **Version Control**: Git / GitHub.
