import { useState, useEffect } from "react";

const STORAGE_KEY = "recent-cnpj-searches";
const MAX_SEARCHES = 5;

interface RecentSearch {
  cnpj: string;
  razaoSocial: string;
  timestamp: number;
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const addSearch = (cnpj: string, razaoSocial: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, "");
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.cnpj !== cleanCnpj);
      const updated = [
        { cnpj: cleanCnpj, razaoSocial, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_SEARCHES);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  return { recentSearches, addSearch, clearSearches };
}
