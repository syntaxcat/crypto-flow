import { useState } from "react";
import { SUPPORTED_SYMBOLS, SupportedSymbol } from "@crypto-flow/shared";
import { useLivePrices } from "./hooks/useLivePrices";
import { PriceCard } from "./components/PriceCard";
import { PriceHistogram } from "./components/PriceHistogram";

export default function App() {
  const [selected, setSelected] = useState<SupportedSymbol>("BTCUSDT");
  const prices = useLivePrices();

  return (
    <div className="app">
      <h1 className="app-title">Crypto Flow</h1>

      <div className="cards-grid">
        {SUPPORTED_SYMBOLS.map((symbol) => (
          <PriceCard
            key={symbol}
            coin={prices[symbol]}
            symbol={symbol}
            isSelected={selected === symbol}
            onClick={() => setSelected(symbol)}
          />
        ))}
      </div>

      <PriceHistogram symbol={selected} />
    </div>
  );
}
