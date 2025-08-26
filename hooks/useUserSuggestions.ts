import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface UseUserSuggestionsProps {
  searchQuery: string;
  enabled?: boolean;
  debounceMs?: number;
}

export const useUserSuggestions = ({
  searchQuery,
  enabled = true,
  debounceMs = 300,
}: UseUserSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/users/suggestions?search=${encodeURIComponent(searchQuery.trim())}&limit=5`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user suggestions");
        }

        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, enabled, debounceMs]);

  return {
    suggestions,
    isLoading,
    error,
  };
};
