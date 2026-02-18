import { SearchBar } from "./SearchBar";

interface HeroSectionProps {
  onAddStock: (symbol: string) => void;
}

export function HeroSection({ onAddStock }: HeroSectionProps) {
  return (
    <section className="bg-muted/30 w-full py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-foreground font-serif text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Stock Graphic
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Professional US market monitoring with editorial precision.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar onAdd={onAddStock} />
          </div>
        </div>
      </div>
    </section>
  );
}
