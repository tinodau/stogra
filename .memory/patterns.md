# Code Patterns & Conventions

Recurring patterns used throughout the Stogra codebase.

---

## TanStack Query Patterns

### Query Keys

Centralized in `hooks/useMarketData.ts`:

```typescript
export const queryKeys = {
  marketSnapshot: ["market", "snapshot"] as const,
  stock: (symbol: string) => ["stock", symbol] as const,
  stocks: (symbols: string[]) => ["stocks", symbols] as const,
};
```

### Standard Hook Pattern

```typescript
export function useStock(symbol: string) {
  return useQuery<StockData | undefined>({
    queryKey: queryKeys.stock(symbol),
    queryFn: () => mockApi.getStocks([symbol]).then((d) => d[0]),
    refetchInterval: 60 * 1000,
    staleTime: 60 * 1000,
    enabled: !!symbol,
  });
}
```

### Key Defaults

- `refetchInterval`: 60000ms (1 minute) for stock data
- `staleTime`: 60000ms (1 minute) to prevent unnecessary refetches
- `enabled`: Guard for dependent queries

---

## Component Patterns

### Skeleton Loader Pattern

Always pair data components with skeleton variants:

```tsx
{
  isLoading ? (
    <SkeletonCard />
  ) : data ? (
    <StockCard stock={data} />
  ) : (
    <EmptyState />
  );
}
```

### Type-First Imports

Always import types separately:

```typescript
import { Component } from "@/components/Component";
import type { StockData } from "@/types";
```

### Props Interface Pattern

```typescript
interface StockCardProps {
  stock: StockData;
  onRemove: () => void;
}

export function StockCard({ stock, onRemove }: StockCardProps) {
  // ...
}
```

---

## Tailwind CSS Patterns

### Class Ordering

Handled automatically by `prettier-plugin-tailwindcss`. Order:

1. Layout (flex, grid, display)
2. Spacing (p-, m-, gap-)
3. Sizing (w-, h-, min-, max-)
4. Typography (font-, text-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, opacity-)
7. State (hover:, focus:)

### Theme Variable Usage

Always use CSS variables from `globals.css`:

```tsx
className =
  "bg-background text-foreground border-border rounded-[var(--radius)]";
```

### Color Conditions

```tsx
const isPositive = change >= 0;
className={`${isPositive ? "text-primary" : "text-destructive"}`}
```

---

## Sparkline Data Pattern

### Data Format

- Array of 7-24 data points (daily closing prices)
- Each point rounded to 2 decimal places
- Most recent price is the last element

### SVG Rendering

```tsx
<SparklineView data={stock.sparkline} positive={stock.change >= 0} />
```

### Color Logic

- `positive={true}` → Teal gradient (`var(--primary)`)
- `positive={false}` → Red gradient (`var(--destructive)`)

---

## API Response Types

All types in `client/src/types/index.ts`:

```typescript
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap: number | null;
  sparkline: number[];
  currency: string;
}
```

---

## LocalStorage Pattern

### Watchlist Hook

```typescript
const STORAGE_KEY = "stogra_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  return { watchlist, add, remove };
}
```

---

## Backend Patterns

### Pydantic Schema

Always define response models matching API contract:

```python
class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    market_cap: int | None
    sparkline: List[float]
    currency: str
```

### Async Batch Fetching

```python
async def get_stocks_batch(self, symbols: List[str]) -> List[Dict]:
    tasks = [self.get_stock_data(symbol) for symbol in symbols]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, dict)]
```

### Error Handling

Always catch and log, return None or empty:

```python
try:
    # fetch logic
except Exception as e:
    print(f"Error fetching {symbol}: {e}")
    return None
```

---

## Mobile-First Responsive Patterns

### Breakpoint Convention

| Breakpoint | Min Width | Usage                        |
| ---------- | --------- | ---------------------------- |
| Default    | 0px       | Mobile (always define first) |
| `sm:`      | 640px     | Large phones, tablets        |
| `md:`      | 768px     | Tablets                      |
| `lg:`      | 1024px    | Desktop                      |

### Mobile-First Class Pattern

Always start with mobile styles, scale up:

```tsx
// Mobile-first sizing
className = "text-sm sm:text-base lg:text-lg";
className = "p-3 sm:p-4 lg:p-6";
className = "gap-3 sm:gap-4 lg:gap-6";
```

### Layout Overflow Prevention

Prevent horizontal scroll on all containers:

```tsx
// Root container
<div className="overflow-x-hidden">

// Main content columns
<main className="min-w-0">
<aside className="min-w-0">
```

### Table on Mobile

Tables should become cards on mobile:

```tsx
// Mobile: card layout
<div className="grid gap-3 sm:hidden">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>

// Tablet+: table layout
<div className="hidden sm:block overflow-x-auto">
  <table>...</table>
</div>
```

### Text Truncation

Prevent text overflow with truncation:

```tsx
<span className="truncate">{longName}</span>
<span className="max-w-[100px] truncate">{name}</span>
```

### Grid Responsiveness

```tsx
// 1 col mobile, 2 cols tablet, 3 cols desktop
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
```
