import { useQuery } from "@tanstack/react-query";
import { SupportedSymbol } from "@crypto-flow/shared";

export interface KlineBar {
  time: string;
  price: number;
}

export type TimeRange = "24h" | "1w" | "1y" | "5y";

const RANGE_CONFIG: Record<TimeRange, { interval: string; limit: number; labelFn: (t: number) => string }> = {
  "24h": {
    interval: "1h",
    limit: 24,
    labelFn: (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  },
  "1w": {
    interval: "4h",
    limit: 42,
    labelFn: (t) => new Date(t).toLocaleDateString([], { weekday: "short", hour: "2-digit" }),
  },
  "1y": {
    interval: "1w",
    limit: 52,
    labelFn: (t) => new Date(t).toLocaleDateString([], { month: "short", day: "numeric" }),
  },
  "5y": {
    interval: "1M",
    limit: 60,
    labelFn: (t) => new Date(t).toLocaleDateString([], { year: "numeric", month: "short" }),
  },
};

async function fetchKlines(symbol: SupportedSymbol, range: TimeRange): Promise<KlineBar[]> {
  const { interval, limit, labelFn } = RANGE_CONFIG[range];
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch klines");
  const data: [number, string, string, string, string, ...unknown[]][] = await res.json();
  return data.map(([openTime, , , , close]) => ({
    time: labelFn(openTime),
    price: parseFloat(close),
  }));
}

export function useCoinHistory(symbol: SupportedSymbol, range: TimeRange) {
  return useQuery({
    queryKey: ["klines", symbol, range],
    queryFn: () => fetchKlines(symbol, range),
    staleTime: 60_000,
  });
}
