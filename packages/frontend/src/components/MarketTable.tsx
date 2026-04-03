import { useState } from "react";
import { useMarketData, MarketCoin } from "../hooks/useMarketData";
import { useCurrency } from "../contexts/CurrencyContext";

type SortKey = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "total_volume";

export function MarketTable() {
  const { currency, symbol } = useCurrency();
  const { data, isLoading } = useMarketData(currency);
  const [sortKey, setSortKey] = useState<SortKey>("market_cap_rank");
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(key === "market_cap_rank"); }
  }

  const sorted = [...(data ?? [])].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  const th = (key: SortKey, label: string) => (
    <th className="market-th" onClick={() => handleSort(key)} style={{ cursor: "pointer" }}>
      {label} {sortKey === key ? (sortAsc ? "▲" : "▼") : ""}
    </th>
  );

  if (isLoading) return <p style={{ color: "var(--text-muted)" }}>Loading market data...</p>;

  return (
    <div className="market-table-wrap">
      <table className="market-table">
        <thead>
          <tr>
            {th("market_cap_rank", "#")}
            <th className="market-th">Coin</th>
            {th("current_price", "Price")}
            {th("price_change_percentage_24h", "24h %")}
            {th("total_volume", "Volume")}
          </tr>
        </thead>
        <tbody>
          {sorted.map((coin: MarketCoin) => {
            const pct = coin.price_change_percentage_24h;
            return (
              <tr key={coin.id} className="market-row">
                <td className="market-td muted">{coin.market_cap_rank}</td>
                <td className="market-td">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img src={coin.image} alt={coin.name} width={20} height={20} style={{ borderRadius: "50%" }} />
                    <span style={{ fontWeight: "bold" }}>{coin.name}</span>
                    <span className="muted" style={{ fontSize: "0.8rem" }}>{coin.symbol.toUpperCase()}</span>
                  </div>
                </td>
                <td className="market-td">{symbol}{coin.current_price.toLocaleString()}</td>
                <td className={`market-td ${pct >= 0 ? "positive" : "negative"}`}>
                  {pct >= 0 ? "▲" : "▼"}{Math.abs(pct).toFixed(2)}%
                </td>
                <td className="market-td muted">{symbol}{(coin.total_volume / 1e6).toFixed(0)}M</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
