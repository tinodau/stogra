const TICKERS_ROW_1 = [
  { symbol: "AAPL", change: "+1.24%" },
  { symbol: "NVDA", change: "+2.44%" },
  { symbol: "TSLA", change: "-0.89%" },
  { symbol: "MSFT", change: "+0.54%" },
  { symbol: "META", change: "+1.08%" },
  { symbol: "AMZN", change: "+0.92%" },
  { symbol: "GOOGL", change: "-0.32%" },
  { symbol: "AMD", change: "+3.12%" },
  { symbol: "NFLX", change: "+1.56%" },
  { symbol: "JPM", change: "+0.78%" },
  { symbol: "V", change: "+0.45%" },
  { symbol: "JNJ", change: "+0.22%" },
  { symbol: "XOM", change: "-0.15%" },
  { symbol: "UNH", change: "+0.67%" },
  { symbol: "CRM", change: "+1.34%" },
];

const TICKERS_ROW_2 = [
  { symbol: "BRK.B", change: "+0.38%" },
  { symbol: "HD", change: "-0.42%" },
  { symbol: "PG", change: "+0.29%" },
  { symbol: "MA", change: "+0.51%" },
  { symbol: "CVX", change: "-0.18%" },
  { symbol: "KO", change: "+0.12%" },
  { symbol: "PFE", change: "-0.67%" },
  { symbol: "ADBE", change: "+1.89%" },
  { symbol: "INTC", change: "-1.23%" },
  { symbol: "VZ", change: "+0.08%" },
  { symbol: "T", change: "-0.34%" },
  { symbol: "DIS", change: "+0.56%" },
  { symbol: "BA", change: "-0.91%" },
  { symbol: "NKE", change: "+0.73%" },
  { symbol: "WMT", change: "+0.41%" },
];

interface TickerItemProps {
  symbol: string;
  change: string;
}

function TickerItem({ symbol, change }: TickerItemProps) {
  const isPositive = !change.startsWith("-");

  return (
    <div className="flex items-center gap-1.5 px-4 whitespace-nowrap">
      <span className="font-mono text-xs font-medium">{symbol}</span>
      <span className={`font-mono text-xs ${isPositive ? "text-primary" : "text-destructive"}`}>
        {change}
      </span>
    </div>
  );
}

export function TickerMarquee() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ticker-row absolute top-[15%] flex">
        <div className="animate-marquee-left flex shrink-0 items-center">
          {[...TICKERS_ROW_1, ...TICKERS_ROW_1].map((ticker, i) => (
            <TickerItem key={`row1-${i}`} symbol={ticker.symbol} change={ticker.change} />
          ))}
        </div>
      </div>

      <div className="ticker-row absolute bottom-[15%] flex">
        <div className="animate-marquee-right flex shrink-0 items-center">
          {[...TICKERS_ROW_2, ...TICKERS_ROW_2].map((ticker, i) => (
            <TickerItem key={`row2-${i}`} symbol={ticker.symbol} change={ticker.change} />
          ))}
        </div>
      </div>
    </div>
  );
}
