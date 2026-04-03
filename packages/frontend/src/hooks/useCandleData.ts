import { useQuery } from "@tanstack/react-query";
import { SupportedSymbol } from "@crypto-flow/shared";
import { TimeRange } from "./useCoinHistory";

export interface CandleBar {
  time: number; // unix seconds (lightweight-charts format)
  open: number;
  high: number;
  low: number;
  close: number;
}

const RANGE_CONFIG: Record<TimeRange, { interval: string; limit: number }> = {
  "24h": { interval: "1h",  limit: 24 },
  "1w":  { interval: "4h",  limit: 42 },
  "1y":  { interval: "1w",  limit: 52 },
  "5y":  { interval: "1M",  limit: 60 },
};

async function fetchCandles(symbol: SupportedSymbol, range: TimeRange): Promise<CandleBar[]> {
  const { interval, limit } = RANGE_CONFIG[range];
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch candles");
  const data: number[][] = await res.json();
  return data.map(([openTime, open, high, low, close]) => ({
    time: Math.floor(openTime / 1000),
    open: parseFloat(String(open)),
    high: parseFloat(String(high)),
    low: parseFloat(String(low)),
    close: parseFloat(String(close)),
  }));
}

export function useCandleData(symbol: SupportedSymbol, range: TimeRange) {
  return useQuery({
    queryKey: ["candles", symbol, range],
    queryFn: () => fetchCandles(symbol, range),
    staleTime: 60_000,
  });
}
