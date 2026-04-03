import { useTheme } from "../contexts/ThemeContext";
import { useCurrency, Currency, CURRENCY_SYMBOLS } from "../contexts/CurrencyContext";

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP"];

export function Header() {
  const { theme, toggle } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="header">
      <span className="header__logo">⚡ Crypto Flow</span>
      <div className="header__controls">
        <div className="currency-switcher">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              className={`currency-btn ${currency === c ? "currency-btn--active" : ""}`}
              onClick={() => setCurrency(c)}
            >
              {CURRENCY_SYMBOLS[c]}<span className="currency-label"> {c}</span>
            </button>
          ))}
        </div>
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
