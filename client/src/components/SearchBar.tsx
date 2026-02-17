import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { SearchResult } from "@/types";
import { mockApi } from "@/api/mock-data";

interface SearchBarProps {
  onAdd?: (symbol: string) => void;
}

export function SearchBar({ onAdd }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      const data = await mockApi.search(trimmed);
      setResults(data);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    onAdd?.(symbol);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search stocks (e.g., AAPL, Tesla)..."
          className="h-14 w-full rounded-[var(--radius)] border border-input bg-card pl-12 pr-12 text-lg shadow-sm transition-all placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (query.trim() || results.length > 0) && (
        <div className="absolute z-50 mt-2 w-full rounded-[var(--radius)] border border-border bg-card shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.symbol}>
                  <button
                    onClick={() => handleSelect(result.symbol)}
                    className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">
                        {result.symbol}
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {result.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase">
                      {result.exchange}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
