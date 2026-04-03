import { useState } from "react";
import { SupportedSymbol } from "@crypto-flow/shared";

function load(): SupportedSymbol[] {
  try { return JSON.parse(localStorage.getItem("favorites") ?? "[]"); } catch { return []; }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<SupportedSymbol[]>(load);

  function toggle(symbol: SupportedSymbol) {
    const next = favorites.includes(symbol)
      ? favorites.filter((s) => s !== symbol)
      : [...favorites, symbol];
    setFavorites(next);
    localStorage.setItem("favorites", JSON.stringify(next));
  }

  return { favorites, toggle, isFavorite: (s: SupportedSymbol) => favorites.includes(s) };
}
