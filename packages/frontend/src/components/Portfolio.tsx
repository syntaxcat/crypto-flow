import { useState } from "react";
import { CoinPrice, SupportedSymbol, SUPPORTED_SYMBOLS } from "@crypto-flow/shared";
import { usePortfolio } from "../hooks/usePortfolio";
import { useCurrency } from "../contexts/CurrencyContext";
import { useExchangeRates } from "../hooks/useExchangeRates";

interface Props {
  prices: Partial<Record<SupportedSymbol, CoinPrice>>;
}

export function Portfolio({ prices }: Props) {
  const { holdings, add, remove } = usePortfolio();
  const { symbol: currencySymbol, convert } = useCurrency();
  const { data: rates = {} } = useExchangeRates();

  const [form, setForm] = useState({ symbol: "BTCUSDT", amount: "", buyPrice: "" });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.buyPrice) return;
    add(form.symbol, parseFloat(form.amount), parseFloat(form.buyPrice));
    setForm((f) => ({ ...f, amount: "", buyPrice: "" }));
  }

  const totalValue = holdings.reduce((sum, h) => {
    const price = parseFloat(prices[h.symbol as SupportedSymbol]?.price ?? "0");
    return sum + convert(price * h.amount, rates);
  }, 0);

  const totalCost = holdings.reduce((sum, h) => sum + convert(h.buyPrice * h.amount, rates), 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return (
    <div>
      <div className="portfolio-summary">
        <div className="portfolio-stat">
          <span className="muted">Total Value</span>
          <span className="portfolio-stat__value">{currencySymbol}{totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="portfolio-stat">
          <span className="muted">Total P&amp;L</span>
          <span className={`portfolio-stat__value ${totalPnl >= 0 ? "positive" : "negative"}`}>
            {totalPnl >= 0 ? "+" : ""}{currencySymbol}{totalPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            {" "}({totalPnlPct >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <form className="portfolio-form" onSubmit={handleAdd}>
        <select className="portfolio-input" value={form.symbol} onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}>
          {SUPPORTED_SYMBOLS.map((s) => <option key={s} value={s}>{s.replace("USDT", "")}</option>)}
        </select>
        <input className="portfolio-input" type="number" placeholder="Amount" step="any" min="0"
          value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
        <input className="portfolio-input" type="number" placeholder="Buy price (USD)" step="any" min="0"
          value={form.buyPrice} onChange={(e) => setForm((f) => ({ ...f, buyPrice: e.target.value }))} />
        <button className="portfolio-add-btn" type="submit">Add</button>
      </form>

      {holdings.length === 0 && <p className="muted" style={{ marginTop: "1rem" }}>No holdings yet. Add your first one above.</p>}

      <div className="holdings-list">
        {holdings.map((h) => {
          const currentUsd = parseFloat(prices[h.symbol as SupportedSymbol]?.price ?? "0");
          const currentPrice = convert(currentUsd, rates);
          const value = currentPrice * h.amount;
          const cost = convert(h.buyPrice, rates) * h.amount;
          const pnl = value - cost;
          const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

          return (
            <div key={h.id} className="holding-row">
              <div className="holding-row__symbol">{h.symbol.replace("USDT", "")}</div>
              <div className="holding-row__detail">
                <span className="muted">{h.amount} × {currencySymbol}{convert(h.buyPrice, rates).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="holding-row__value">{currencySymbol}{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className={`holding-row__pnl ${pnl >= 0 ? "positive" : "negative"}`}>
                {pnl >= 0 ? "+" : ""}{currencySymbol}{pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({pnlPct.toFixed(2)}%)
              </div>
              <button className="holding-row__remove" onClick={() => remove(h.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
