import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SupportedSymbol } from "@crypto-flow/shared";
import { useCoinHistory, TimeRange } from "../hooks/useCoinHistory";

interface Props {
  symbol: SupportedSymbol;
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: "24H", value: "24h" },
  { label: "1W", value: "1w" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

export function PriceHistogram({ symbol }: Props) {
  const [range, setRange] = useState<TimeRange>("24h");
  const { data, isLoading, isError } = useCoinHistory(symbol, range);

  const min = data ? Math.min(...data.map((d) => d.price)) : 0;
  const max = data ? Math.max(...data.map((d) => d.price)) : 0;
  const padding = (max - min) * 0.1;

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0 }}>{symbol.replace("USDT", "")} Price History</h3>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                background: range === value ? "#4f46e5" : "#fff",
                color: range === value ? "#fff" : "#374151",
                fontWeight: range === value ? "bold" : "normal",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p style={{ color: "#9ca3af" }}>Loading chart...</p>}
      {isError && <p style={{ color: "#dc2626" }}>Failed to load chart.</p>}

      {data && (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <XAxis dataKey="time" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis
              domain={[min - padding, max + padding]}
              tickFormatter={(v: number) => `$${v.toLocaleString()}`}
              tick={{ fontSize: 11 }}
              width={90}
            />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Close"]} />
            <Bar dataKey="price" fill="#4f46e5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
