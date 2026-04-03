import { useState } from "react";
import { SUPPORTED_SYMBOLS, SupportedSymbol } from "@crypto-flow/shared";
import { useLivePrices } from "./hooks/useLivePrices";
import { useFavorites } from "./hooks/useFavorites";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { Nav, Tab } from "./components/Nav";
import { PriceCard } from "./components/PriceCard";
import { PriceHistogram } from "./components/PriceHistogram";
import { PriceAlertModal } from "./components/PriceAlertModal";
import { MarketTable } from "./components/MarketTable";
import { FearGreed } from "./components/FearGreed";
import { TrendingCoins } from "./components/TrendingCoins";
import { Portfolio } from "./components/Portfolio";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selected, setSelected] = useState<SupportedSymbol>("BTCUSDT");
  const prices = useLivePrices();
  const { favorites, toggle, isFavorite } = useFavorites();

  // Show favorites first if any are set
  const orderedSymbols = [
    ...SUPPORTED_SYMBOLS.filter(isFavorite),
    ...SUPPORTED_SYMBOLS.filter((s) => !isFavorite(s)),
  ];

  return (
    <>
      <Header />
      <Ticker prices={prices} />
      <Nav tab={tab} onChange={setTab} />

      <main className="app">
        {tab === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", position: "relative" }}>
              <PriceAlertModal prices={prices} />
            </div>

            <div className="cards-grid">
              {orderedSymbols.map((symbol) => (
                <PriceCard
                  key={symbol}
                  coin={prices[symbol]}
                  symbol={symbol}
                  isSelected={selected === symbol}
                  isFavorite={isFavorite(symbol)}
                  onClick={() => setSelected(symbol)}
                  onFavoriteToggle={() => toggle(symbol)}
                />
              ))}
            </div>

            <PriceHistogram symbol={selected} />
          </>
        )}

        {tab === "market" && (
          <div className="market-layout">
            <div className="market-main">
              <h2 className="section-title">Market Overview</h2>
              <MarketTable />
            </div>
            <div className="market-sidebar">
              <FearGreed />
              <TrendingCoins />
            </div>
          </div>
        )}

        {tab === "portfolio" && (
          <>
            <h2 className="section-title">Portfolio</h2>
            <Portfolio prices={prices} />
          </>
        )}
      </main>
    </>
  );
}
