import { useState } from "react";
import { SUPPORTED_SYMBOLS, SupportedSymbol } from "@crypto-flow/shared";
import { useLivePrices } from "./hooks/useLivePrices";
import { PriceCard } from "./components/PriceCard";

export default function App() {
  const [selected, setSelected] = useState<SupportedSymbol>("BTCUSDT");
  const prices = useLivePrices();

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Crypto Flow</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
    </div>
  );
}
