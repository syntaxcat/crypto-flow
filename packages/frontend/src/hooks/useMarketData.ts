import { useQuery } from "@tanstack/react-query";
import { Currency } from "../contexts/CurrencyContext";

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

async function fetchMarket(currency: Currency): Promise<MarketCoin[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
}

export function useMarketData(currency: Currency) {
  return useQuery({
    queryKey: ["market", currency],
    queryFn: () => fetchMarket(currency),
    staleTime: 60_000,
  });
}
