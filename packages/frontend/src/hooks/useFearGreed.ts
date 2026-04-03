import { useQuery } from "@tanstack/react-query";

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

async function fetchFearGreed(): Promise<FearGreedData> {
  const res = await fetch("https://api.alternative.me/fng/?limit=1");
  if (!res.ok) throw new Error("Failed to fetch fear & greed");
  const data = await res.json();
  return data.data[0];
}

export function useFearGreed() {
  return useQuery({
    queryKey: ["fear-greed"],
    queryFn: fetchFearGreed,
    staleTime: 5 * 60_000,
  });
}
