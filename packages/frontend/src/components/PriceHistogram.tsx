import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SupportedSymbol } from "@crypto-flow/shared";
import { useCoinHistory } from "../hooks/useCoinHistory";

interface Props {
  symbol: SupportedSymbol;
}

export function PriceHistogram({ symbol }: Props) {
  const { data, isLoading, isError } = useCoinHistory(symbol);

  if (isLoading) return <p style={{ color: "#9ca3af" }}>Loading chart...</p>;
  if (isError) return <p style={{ color: "#dc2626" }}>Failed to load chart.</p>;

  const min = Math.min(...data!.map((d) => d.price));
  const max = Math.max(...data!.map((d) => d.price));
  const padding = (max - min) * 0.1;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>
        {symbol.replace("USDT", "")} — last 24h (1h closes)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval={3}
          />
          <YAxis
            domain={[min - padding, max + padding]}
            tickFormatter={(v: number) => `$${v.toLocaleString()}`}
            tick={{ fontSize: 11 }}
            width={80}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Close"]}
          />
          <Bar dataKey="price" fill="#4f46e5" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
