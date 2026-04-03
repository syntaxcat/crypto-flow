import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { SupportedSymbol } from "@crypto-flow/shared";
import { TimeRange } from "../hooks/useCoinHistory";
import { useCandleData } from "../hooks/useCandleData";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  symbol: SupportedSymbol;
  range: TimeRange;
}

export function CandlestickChart({ symbol, range }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { theme } = useTheme();
  const { data, isLoading } = useCandleData(symbol, range);

  const isDark = theme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 220,
      layout: {
        background: { color: isDark ? "#1e293b" : "#ffffff" },
        textColor: isDark ? "#94a3b8" : "#374151",
      },
      grid: {
        vertLines: { color: isDark ? "#334155" : "#f0f0f0" },
        horzLines: { color: isDark ? "#334155" : "#f0f0f0" },
      },
      timeScale: { borderColor: isDark ? "#334155" : "#e5e7eb" },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderUpColor: "#16a34a",
      borderDownColor: "#dc2626",
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.resize(containerRef.current.clientWidth, 220);
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chartRef.current?.remove(); };
  }, [theme]);

  useEffect(() => {
    if (seriesRef.current && data) {
      seriesRef.current.setData(data as never);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading && <p style={{ color: "var(--text-muted)", position: "absolute", padding: "0.5rem" }}>Loading...</p>}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}
