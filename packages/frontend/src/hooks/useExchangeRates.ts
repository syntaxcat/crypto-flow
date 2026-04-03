import { useQuery } from "@tanstack/react-query";

async function fetchRates(): Promise<Record<string, number>> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) return {};
  const data = await res.json();
  return data.rates ?? {};
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchRates,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
