import { useQuery } from "@tanstack/react-query";
import { SupportedSymbol } from "@crypto-flow/shared";

export interface KlineBar {
  time: string;   // formatted hour label
  price: number;  // close price
}

async function fetchKlines(symbol: SupportedSymbol): Promise<KlineBar[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`
  );
  if (!res.ok) throw new Error("Failed to fetch klines");
  const data: [number, string, string, string, string, ...unknown[]][] = await res.json();
  return data.map(([openTime, , , , close]) => ({
    time: new Date(openTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: parseFloat(close),
  }));
}

export function useCoinHistory(symbol: SupportedSymbol) {
  return useQuery({
    queryKey: ["klines", symbol],
    queryFn: () => fetchKlines(symbol),
    staleTime: 60_000,
  });
}
