import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setLight, setDark, setSystem, isDark } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      <button
        onClick={setLight}
        className={`rounded-md p-2 transition-colors ${
          theme === "light"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={setDark}
        className={`rounded-md p-2 transition-colors ${
          theme === "dark"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={setSystem}
        className={`rounded-md p-2 transition-colors ${
          theme === "system"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="System preference"
        title="System preference"
      >
        <Laptop className="h-4 w-4" />
      </button>
    </div>
  );
}

// Simple toggle button for mobile/navbar
export function ThemeToggleSimple() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
