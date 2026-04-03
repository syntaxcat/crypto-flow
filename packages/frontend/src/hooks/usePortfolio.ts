import { useState } from "react";

export interface Holding {
  id: string;
  symbol: string;   // e.g. "BTCUSDT"
  amount: number;
  buyPrice: number;
}

function load(): Holding[] {
  try { return JSON.parse(localStorage.getItem("portfolio") ?? "[]"); } catch { return []; }
}

function save(holdings: Holding[]) {
  localStorage.setItem("portfolio", JSON.stringify(holdings));
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(load);

  function add(symbol: string, amount: number, buyPrice: number) {
    const next = [...holdings, { id: crypto.randomUUID(), symbol, amount, buyPrice }];
    setHoldings(next);
    save(next);
  }

  function remove(id: string) {
    const next = holdings.filter((h) => h.id !== id);
    setHoldings(next);
    save(next);
  }

  return { holdings, add, remove };
}
