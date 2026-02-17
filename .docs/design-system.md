# Design System: Stogra Editorial

## 1. Design Philosophy

**Stogra** follows a "Modern Business Daily" aesthetic. It prioritizes white space, precise typography, and a "paper-like" feel in light mode, transitioning into a "deep-space" analytical tool in dark mode.

- **Clarity over Clutter**: No flashy animations or neon colors.
- **Data as Art**: Stock charts (sparklines) are integrated as clean, graphic elements.
- **Precision**: Using the OKLCH color space for perceptually accurate colors across themes.

## 2. Color Palette (OKLCH)

All colors must be implemented via CSS variables using the Tweakcn OKLCH tokens.

### 2.1 Base Colors (Light Mode)

- **Background**: `oklch(0.9940 0 0)`
- **Foreground**: `oklch(0 0 0)`
- **Card**: `oklch(0.9940 0 0)`
- **Primary (Growth)**: `oklch(0.8545 0.1675 159.6564)`
- **Destructive (Loss)**: `oklch(0.6665 0.2111 2.8306)`
- **Accent**: `oklch(0.9947 0.0074 164.9465)`
- **Border**: `oklch(0.9722 0.0034 247.8581)`

### 2.2 Base Colors (Dark Mode)

- **Background**: `oklch(0 0 0)`
- **Foreground**: `oklch(0.9551 0 0)`
- **Card**: `oklch(0.1448 0 0)`
- **Primary**: `oklch(0.8545 0.1675 159.6564)`
- **Destructive**: `oklch(0.7425 0.1696 1.0847)`
- **Accent**: `oklch(0.3004 0.0609 159.8938)`
- **Border**: `oklch(0.2138 0.0019 286.2347)`

## 3. Typography

A tri-font system to distinguish between UI, narrative, and financial data.

- **Sans (Primary UI)**: `Plus Jakarta Sans`, sans-serif
  - _Usage_: Navigation, Buttons, Labels, General UI.
- **Serif (Editorial)**: `Lora`, serif
  - _Usage_: Hero Headlines, Section Titles, Editorial descriptions.
- **Mono (Data/Numbers)**: `IBM Plex Mono`, monospace
  - _Usage_: Stock prices, percentage changes, market caps. Ensures tabular numbers align perfectly.

## 4. Layout & Components

### 4.1 Grid System

- **Homepage Structure**:
  - Main Content (66% width): Watchlist and Market Feed.
  - Sidebar (33% width): Top Market Cap and Daily Movers.
- **Spacing**: Consistent `0.27rem` increments based on `--spacing` token.

### 4.2 Interactive Elements

- **Radius**: Large `1.4rem` (`--radius`) for cards and inputs to provide a modern "pill" or "soft-rect" aesthetic.
- **Search Hero**:
  - Centered in the Hero section.
  - Prominent input field with `var(--shadow-xl)` on focus.
- **Shadows**:
  - Use `var(--shadow-sm)` for standard cards.
  - Use `var(--shadow-md)` for hover states.

### 4.3 Data Visualization (Sparklines)

- **Colors**:
  - Positive: `var(--primary)`
  - Negative: `var(--destructive)`
- **Style**: Minimalist, no grid lines, no axes.
- **Stroke**: `2px` width, smooth interpolation.

## 5. Iconography

- **Provider**: Lucide React.
- **Stroke Width**: `1.5` or `2`.
- **Consistency**: All icons must share the same stroke weight and color (usually `var(--muted-foreground)`).

## 6. Theme Logic

- **Transitions**: Smooth `duration-300` transitions for background and text colors.
- **Mode**: Default to system setting with a manual override toggle in the Navbar.
