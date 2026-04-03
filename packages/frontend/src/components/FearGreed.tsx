import { useFearGreed } from "../hooks/useFearGreed";

const COLOR_MAP: Record<string, string> = {
  "Extreme Fear": "#dc2626",
  "Fear": "#f97316",
  "Neutral": "#eab308",
  "Greed": "#84cc16",
  "Extreme Greed": "#16a34a",
};

export function FearGreed() {
  const { data, isLoading } = useFearGreed();

  if (isLoading) return <div className="widget">Loading...</div>;
  if (!data) return null;

  const value = parseInt(data.value);
  const color = COLOR_MAP[data.value_classification] ?? "#9ca3af";

  return (
    <div className="widget">
      <div className="widget__title">Fear &amp; Greed Index</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.75rem" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `conic-gradient(${color} ${value}%, var(--border) 0)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--surface)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: "1rem",
          }}>
            {value}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: "bold", color }}>{data.value_classification}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Updated daily</div>
        </div>
      </div>
    </div>
  );
}
