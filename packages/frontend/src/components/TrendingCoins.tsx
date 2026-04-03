import { useTrending } from "../hooks/useTrending";

export function TrendingCoins() {
  const { data, isLoading } = useTrending();

  if (isLoading) return <div className="widget">Loading trending...</div>;
  if (!data?.length) return null;

  return (
    <div className="widget">
      <div className="widget__title">🔥 Trending</div>
      <ul className="trending-list">
        {data.slice(0, 7).map(({ item }) => {
          const pct = item.data?.price_change_percentage_24h?.usd;
          return (
            <li key={item.id} className="trending-item">
              <img src={item.thumb} alt={item.name} width={20} height={20} style={{ borderRadius: "50%" }} />
              <span style={{ fontWeight: "bold" }}>{item.name}</span>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{item.symbol.toUpperCase()}</span>
              {pct != null && (
                <span className={pct >= 0 ? "positive" : "negative"} style={{ marginLeft: "auto", fontSize: "0.8rem" }}>
                  {pct >= 0 ? "▲" : "▼"}{Math.abs(pct).toFixed(2)}%
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
