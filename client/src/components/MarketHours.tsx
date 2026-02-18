import { Clock } from "lucide-react";
import { useMarketStatus } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function MarketHours() {
  const { data: status, isLoading } = useMarketStatus();

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-[var(--radius)] border p-4">
        <SkeletonSidebarItem />
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="border-border bg-card rounded-[var(--radius)] border p-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-primary animate-pulse" : "bg-muted-foreground"}`}
        />
        <span className="text-sm font-medium">
          {status.exchange} {status.isOpen ? "Open" : "Closed"}
        </span>
      </div>
      <div className="text-muted-foreground mt-2 text-xs">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{status.isOpen ? `Closes ${status.closeTime}` : `Opens ${status.openTime}`}</span>
        </div>
        {status.isOpen && (
          <span className="mt-1 block font-mono">{status.countdown} remaining</span>
        )}
      </div>
    </div>
  );
}
