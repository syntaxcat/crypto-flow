export type Tab = "dashboard" | "market" | "portfolio";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

const TABS: { label: string; value: Tab }[] = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Market",    value: "market"    },
  { label: "Portfolio", value: "portfolio" },
];

export function Nav({ tab, onChange }: Props) {
  return (
    <nav className="nav">
      {TABS.map(({ label, value }) => (
        <button
          key={value}
          className={`nav-btn ${tab === value ? "nav-btn--active" : ""}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
