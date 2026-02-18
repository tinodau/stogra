import { TrendingUp, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-border bg-muted/30 mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <span className="font-serif text-lg font-semibold">Stogra</span>
          </div>

          <p className="text-muted-foreground max-w-md text-sm">
            Professional stock monitoring with editorial precision. Data provided by Yahoo Finance.
            Not investment advice.
          </p>

          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span>Built with React + FastAPI</span>
            <span>•</span>
            <span>© 2025 Stogra</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span>Made with</span>
            <Heart className="text-destructive h-3 w-3 fill-current" />
            <span>for investors</span>
          </div>
        </div>

        <div className="text-muted-foreground mt-6 text-center text-xs">
          <p>
            Stock data is provided for informational purposes only and should not be used for
            trading decisions. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
}
