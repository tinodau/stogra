import { Calendar, Clock } from "lucide-react";
import { useEarnings } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function EarningsCalendar() {
  const { data: earnings, isLoading } = useEarnings(8);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonSidebarItem key={i} />
        ))}
      </div>
    );
  }

  if (!earnings || earnings.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Earnings Calendar</h2>
        <span className="text-muted-foreground text-sm">Upcoming</span>
      </div>

      <div className="border-border overflow-hidden rounded-(--radius) border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Symbol</th>
              <th className="px-4 py-2 text-left font-medium">Time</th>
              <th className="px-4 py-2 text-right font-medium">EPS Est.</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {earnings.map((earning, index) => (
              <tr
                key={`${earning.symbol}-${index}`}
                className="bg-card hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{earning.date}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-mono font-semibold">{earning.symbol}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{earning.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${
                      earning.time === "before_market"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : earning.time === "after_market"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {earning.time === "before_market"
                      ? "Pre-market"
                      : earning.time === "after_market"
                        ? "After hours"
                        : "During"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {earning.expected_eps ? `$${earning.expected_eps.toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
