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
