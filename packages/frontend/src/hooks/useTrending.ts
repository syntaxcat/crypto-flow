import { useQuery } from "@tanstack/react-query";

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    data: { price_change_percentage_24h: { usd: number } };
  };
}

async function fetchTrending(): Promise<TrendingCoin[]> {
  const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
  if (!res.ok) throw new Error("Failed to fetch trending");
  const data = await res.json();
  return data.coins ?? [];
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 5 * 60_000,
  });
}
