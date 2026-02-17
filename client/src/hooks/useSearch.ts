/**
 * useSearch Hook
 * Provides debounced search functionality (300ms)
 */

import { useState, useEffect, useTransition } from "react";
import type { SearchResult } from "@/types";
import { mockApi } from "@/api/mock-data";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await mockApi.search(trimmed);
        setResults(data);
        setIsLoading(false);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading: isLoading || isPending,
  };
}
