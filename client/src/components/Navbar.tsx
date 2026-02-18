import { TrendingUp } from "lucide-react";
import { ThemeToggleSimple } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <TrendingUp className="text-primary h-6 w-6" />
            <span className="font-serif text-xl font-semibold tracking-tight">Stogra</span>
          </a>
          <div className="hidden gap-6 md:flex">
            <a
              href="/"
              className="text-foreground hover:text-muted-foreground text-sm font-medium transition-colors"
            >
              Markets
            </a>
            <a
              href="/#watchlist"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Watchlist
            </a>
            <a
              href="/#"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              About
            </a>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggleSimple />
        </div>
      </nav>
    </header>
  );
}
