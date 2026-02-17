import { TrendingUp } from "lucide-react";
import { ThemeToggleSimple } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Stogra
            </span>
          </a>
          <div className="hidden gap-6 md:flex">
            <a
              href="/"
              className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              Markets
            </a>
            <a
              href="/#watchlist"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Watchlist
            </a>
            <a
              href="/#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
