/**
 * useWatchlist Hook
 * Manages watchlist state with LocalStorage persistence
 */

import { useState, useEffect, useCallback } from "react";

const WATCHLIST_KEY = "stogra_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      } catch {
        console.error("Failed to parse watchlist");
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const add = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      const upper = symbol.toUpperCase();
      if (prev.includes(upper)) return prev;
      return [...prev, upper];
    });
  }, []);

  const remove = useCallback((symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol.toUpperCase()));
  }, []);

  const toggle = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase();
    setWatchlist((prev) =>
      prev.includes(upper) ? prev.filter((s) => s !== upper) : [...prev, upper]
    );
  }, []);

  const clear = useCallback(() => {
    setWatchlist([]);
  }, []);

  const has = useCallback(
    (symbol: string) => watchlist.includes(symbol.toUpperCase()),
    [watchlist]
  );

  return {
    watchlist,
    isLoaded,
    add,
    remove,
    toggle,
    clear,
    has,
    count: watchlist.length,
  };
}
