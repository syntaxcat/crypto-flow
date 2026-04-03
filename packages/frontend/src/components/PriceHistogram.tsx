import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SupportedSymbol } from "@crypto-flow/shared";
import { useCoinHistory, TimeRange } from "../hooks/useCoinHistory";
import { CandlestickChart } from "./CandlestickChart";

interface Props {
  symbol: SupportedSymbol;
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: "24H", value: "24h" },
  { label: "1W",  value: "1w"  },
  { label: "1Y",  value: "1y"  },
  { label: "5Y",  value: "5y"  },
];

type ChartType = "bar" | "candle";

export function PriceHistogram({ symbol }: Props) {
  const [range, setRange] = useState<TimeRange>("24h");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const { data, isLoading, isError } = useCoinHistory(symbol, range);

  const min = data ? Math.min(...data.map((d) => d.price)) : 0;
  const max = data ? Math.max(...data.map((d) => d.price)) : 0;
  const padding = (max - min) * 0.1;
  const isMobile = window.innerWidth <= 640;

  return (
    <div className="histogram">
      <div className="histogram-header">
        <h3 className="histogram-title">{symbol.replace("USDT", "")} Price History</h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <div className="range-filters">
            {RANGES.map(({ label, value }) => (
              <button key={value} className="range-btn" onClick={() => setRange(value)}
                style={{ background: range === value ? "var(--primary)" : "var(--surface)", color: range === value ? "#fff" : "var(--text)", fontWeight: range === value ? "bold" : "normal" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="range-filters">
            {(["bar", "candle"] as ChartType[]).map((t) => (
              <button key={t} className="range-btn" onClick={() => setChartType(t)}
                style={{ background: chartType === t ? "var(--primary)" : "var(--surface)", color: chartType === t ? "#fff" : "var(--text)", fontWeight: chartType === t ? "bold" : "normal", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <p style={{ color: "var(--text-muted)" }}>Loading chart...</p>}
      {isError   && <p style={{ color: "var(--negative)" }}>Failed to load chart.</p>}

      {chartType === "candle" ? (
        <CandlestickChart symbol={symbol} range={range} />
      ) : (
        data && (
          <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis
                domain={[min - padding, max + padding]}
                tickFormatter={(v: number) => isMobile ? `$${(v / 1000).toFixed(0)}k` : `$${v.toLocaleString()}`}
                tick={{ fontSize: 10 }}
                width={isMobile ? 52 : 90}
              />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Close"]} />
              <Bar dataKey="price" fill="var(--primary)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      )}
    </div>
  );
}
