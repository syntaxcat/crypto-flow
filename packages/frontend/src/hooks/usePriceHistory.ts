import { useQuery } from "@tanstack/react-query";
import { PriceSnapshot } from "@prisma/client";
import { SupportedSymbol } from "@crypto-flow/shared";

async function fetchHistory(symbol: SupportedSymbol): Promise<PriceSnapshot[]> {
  const res = await fetch(`/api/prices/history/${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch price history");
  return res.json();
}

export function usePriceHistory(symbol: SupportedSymbol) {
  return useQuery({
    queryKey: ["price-history", symbol],
    queryFn: () => fetchHistory(symbol),
    staleTime: 30_000,
  });
}
