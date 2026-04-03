import { CoinPrice, SupportedSymbol } from "@crypto-flow/shared";
import { useCurrency } from "../contexts/CurrencyContext";
import { useExchangeRates } from "../hooks/useExchangeRates";

interface Props {
  prices: Partial<Record<SupportedSymbol, CoinPrice>>;
}

export function Ticker({ prices }: Props) {
  const { symbol, convert } = useCurrency();
  const { data: rates = {} } = useExchangeRates();

  const items = Object.values(prices).filter(Boolean) as CoinPrice[];
  if (items.length === 0) return <div className="ticker"><span className="ticker__connecting">Connecting to live feed...</span></div>;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="ticker">
      <div className="ticker__track">
        {doubled.map((coin, i) => {
          const pct = parseFloat(coin.priceChangePercent);
          const price = convert(parseFloat(coin.price), rates);
          return (
            <span key={i} className="ticker__item">
              <span className="ticker__symbol">{coin.symbol.replace("USDT", "")}</span>
              <span className="ticker__price">{symbol}{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={`ticker__change ${pct >= 0 ? "positive" : "negative"}`}>
                {pct >= 0 ? "▲" : "▼"}{Math.abs(pct).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
