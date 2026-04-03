import { useEffect, useState } from "react";
import { CoinPrice, SupportedSymbol } from "@crypto-flow/shared";

export interface PriceAlert {
  id: string;
  symbol: SupportedSymbol;
  targetPrice: number;
  direction: "above" | "below";
  triggered: boolean;
}

function load(): PriceAlert[] {
  try { return JSON.parse(localStorage.getItem("alerts") ?? "[]"); } catch { return []; }
}

function save(alerts: PriceAlert[]) {
  localStorage.setItem("alerts", JSON.stringify(alerts));
}

export function usePriceAlerts(prices: Partial<Record<SupportedSymbol, CoinPrice>>) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(load);

  function add(symbol: SupportedSymbol, targetPrice: number, direction: "above" | "below") {
    const next = [...alerts, { id: crypto.randomUUID(), symbol, targetPrice, direction, triggered: false }];
    setAlerts(next);
    save(next);
  }

  function remove(id: string) {
    const next = alerts.filter((a) => a.id !== id);
    setAlerts(next);
    save(next);
  }

  // Check alerts on each price update
  useEffect(() => {
    let changed = false;
    const next = alerts.map((alert) => {
      if (alert.triggered) return alert;
      const price = parseFloat(prices[alert.symbol]?.price ?? "0");
      if (!price) return alert;
      const fired =
        (alert.direction === "above" && price >= alert.targetPrice) ||
        (alert.direction === "below" && price <= alert.targetPrice);
      if (fired) {
        changed = true;
        if (Notification.permission === "granted") {
          new Notification(`Crypto Flow Alert`, {
            body: `${alert.symbol.replace("USDT", "")} is ${alert.direction} $${alert.targetPrice.toLocaleString()}`,
          });
        }
        return { ...alert, triggered: true };
      }
      return alert;
    });
    if (changed) { setAlerts(next); save(next); }
  }, [prices]);

  function requestPermission() {
    Notification.requestPermission();
  }

  return { alerts, add, remove, requestPermission };
}
