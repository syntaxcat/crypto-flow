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
      className="price-card"
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? "#4f46e5" : "#e5e7eb"}`,
        background: isSelected ? "#eef2ff" : "#fff",
      }}
    >
      <div className="price-card__symbol">{symbol.replace("USDT", "")}</div>

      {coin ? (
        <>
          <div className="price-card__price">
            ${parseFloat(coin.price).toLocaleString()}
          </div>
          <div
            className="price-card__change"
            style={{ color: isPositive ? "#16a34a" : "#dc2626" }}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent!).toFixed(2)}%
          </div>
        </>
      ) : (
        <div className="price-card__connecting">Connecting...</div>
      )}
    </div>
  );
}
