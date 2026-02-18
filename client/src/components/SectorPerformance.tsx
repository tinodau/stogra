import { useSectors } from "@/hooks/useMarketData";
import { SkeletonSidebarItem } from "./SkeletonCard";

export function SectorPerformance() {
  const { data: sectors, isLoading } = useSectors();

  if (isLoading) {
    return (
      <div className="border-border bg-card rounded-(--radius) border p-4">
        <h3 className="mb-4 font-serif text-lg font-semibold">Sectors</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonSidebarItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!sectors) return null;

  const maxChange = Math.max(...sectors.map((s) => Math.abs(s.change_percent)));

  return (
    <div className="border-border bg-card rounded-(--radius) border p-4">
      <h3 className="mb-4 font-serif text-lg font-semibold">Sectors</h3>
      <div className="space-y-3">
        {sectors.map((sector) => {
          const isPositive = sector.change_percent >= 0;
          const barWidth = (Math.abs(sector.change_percent) / maxChange) * 100;

          return (
            <div key={sector.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{sector.name}</span>
                <span
                  className={`font-mono text-xs ${isPositive ? "text-primary" : "text-destructive"}`}
                >
                  {isPositive ? "+" : ""}
                  {sector.change_percent.toFixed(2)}%
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${isPositive ? "bg-primary" : "bg-destructive"}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
