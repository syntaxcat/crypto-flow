import { createContext, useContext, useState } from "react";

export type Currency = "USD" | "EUR" | "GBP";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usdAmount: number, rates: Record<string, number>) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  convert: (v) => v,
  symbol: "$",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(
    () => (localStorage.getItem("currency") as Currency) ?? "USD"
  );

  function convert(usdAmount: number, rates: Record<string, number>): number {
    if (currency === "USD") return usdAmount;
    return usdAmount * (rates[currency] ?? 1);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: (c) => { setCurrency(c); localStorage.setItem("currency", c); }, convert, symbol: CURRENCY_SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
