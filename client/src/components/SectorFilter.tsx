import type { SectorFilter } from "@/types";

interface SectorFilterProps {
  activeSector: SectorFilter;
  onSectorChange: (sector: SectorFilter) => void;
}

const SECTORS: { value: SectorFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tech", label: "Tech" },
  { value: "finance", label: "Finance" },
  { value: "energy", label: "Energy" },
  { value: "healthcare", label: "Healthcare" },
];

export function SectorFilter({ activeSector, onSectorChange }: SectorFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SECTORS.map((sector) => (
        <button
          key={sector.value}
          onClick={() => onSectorChange(sector.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeSector === sector.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {sector.label}
        </button>
      ))}
    </div>
  );
}
