import { useState } from "react";
import { CoinPrice, SupportedSymbol, SUPPORTED_SYMBOLS } from "@crypto-flow/shared";
import { usePriceAlerts } from "../hooks/usePriceAlerts";

interface Props {
  prices: Partial<Record<SupportedSymbol, CoinPrice>>;
}

export function PriceAlertModal({ prices }: Props) {
  const { alerts, add, remove, requestPermission } = usePriceAlerts(prices);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ symbol: "BTCUSDT" as SupportedSymbol, targetPrice: "", direction: "above" as "above" | "below" });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.targetPrice) return;
    requestPermission();
    add(form.symbol, parseFloat(form.targetPrice), form.direction);
    setForm((f) => ({ ...f, targetPrice: "" }));
  }

  return (
    <>
      <button className="alert-trigger-btn" onClick={() => setOpen((o) => !o)}>
        🔔 Alerts {alerts.filter((a) => !a.triggered).length > 0 && <span className="alert-badge">{alerts.filter((a) => !a.triggered).length}</span>}
      </button>

      {open && (
        <div className="alert-panel">
          <div className="alert-panel__title">Price Alerts</div>
          <form className="alert-form" onSubmit={handleAdd}>
            <select className="portfolio-input" value={form.symbol} onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value as SupportedSymbol }))}>
              {SUPPORTED_SYMBOLS.map((s) => <option key={s} value={s}>{s.replace("USDT", "")}</option>)}
            </select>
            <select className="portfolio-input" value={form.direction} onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value as "above" | "below" }))}>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input className="portfolio-input" type="number" placeholder="Target price (USD)" step="any" min="0"
              value={form.targetPrice} onChange={(e) => setForm((f) => ({ ...f, targetPrice: e.target.value }))} />
            <button className="portfolio-add-btn" type="submit">Set Alert</button>
          </form>

          <ul className="alert-list">
            {alerts.map((a) => (
              <li key={a.id} className={`alert-item ${a.triggered ? "alert-item--triggered" : ""}`}>
                <span>{a.symbol.replace("USDT", "")} {a.direction} ${a.targetPrice.toLocaleString()}</span>
                {a.triggered && <span className="muted" style={{ fontSize: "0.75rem" }}> ✓ fired</span>}
                <button className="holding-row__remove" onClick={() => remove(a.id)}>✕</button>
              </li>
            ))}
            {alerts.length === 0 && <li className="muted" style={{ fontSize: "0.85rem" }}>No alerts set.</li>}
          </ul>
        </div>
      )}
    </>
  );
}
