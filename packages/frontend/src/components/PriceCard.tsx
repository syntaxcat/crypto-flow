import { CoinPrice, SupportedSymbol } from "@crypto-flow/shared";

interface Props {
  symbol: SupportedSymbol;
  coin: CoinPrice | undefined;
  isSelected: boolean;
  onClick: () => void;
}

export function PriceCard({ symbol, coin, isSelected, onClick }: Props) {
  const changePercent = coin ? parseFloat(coin.priceChangePercent) : null;
  const isPositive = changePercent !== null && changePercent >= 0;

  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? "#4f46e5" : "#e5e7eb"}`,
        borderRadius: "12px",
        padding: "1rem 1.5rem",
        cursor: "pointer",
        minWidth: "180px",
        background: isSelected ? "#eef2ff" : "#fff",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{symbol.replace("USDT", "")}</div>

      {coin ? (
        <>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold", marginTop: "0.25rem" }}>
            ${parseFloat(coin.price).toLocaleString()}
          </div>
          <div style={{ color: isPositive ? "#16a34a" : "#dc2626", fontSize: "0.85rem" }}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent!).toFixed(2)}%
          </div>
        </>
      ) : (
        <div style={{ color: "#9ca3af", marginTop: "0.25rem" }}>Connecting...</div>
      )}
    </div>
  );
}
