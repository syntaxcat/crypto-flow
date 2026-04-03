import { CoinPrice, SupportedSymbol } from "@crypto-flow/shared";
import { useCurrency } from "../contexts/CurrencyContext";
import { useExchangeRates } from "../hooks/useExchangeRates";

interface Props {
  symbol: SupportedSymbol;
  coin: CoinPrice | undefined;
  isSelected: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteToggle: () => void;
}

export function PriceCard({ symbol, coin, isSelected, isFavorite, onClick, onFavoriteToggle }: Props) {
  const { symbol: currencySymbol, convert } = useCurrency();
  const { data: rates = {} } = useExchangeRates();

  const changePercent = coin ? parseFloat(coin.priceChangePercent) : null;
  const isPositive = changePercent !== null && changePercent >= 0;
  const price = coin ? convert(parseFloat(coin.price), rates) : null;

  return (
    <div
      className="price-card"
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
        background: isSelected ? "var(--primary-bg)" : "var(--surface)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="price-card__symbol">{symbol.replace("USDT", "")}</div>
        <button
          className="favorite-btn"
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      {coin ? (
        <>
          <div className="price-card__price">{currencySymbol}{price!.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="price-card__change" style={{ color: isPositive ? "var(--positive)" : "var(--negative)" }}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent!).toFixed(2)}%
          </div>
        </>
      ) : (
        <div className="price-card__connecting">Connecting...</div>
      )}
    </div>
  );
}
