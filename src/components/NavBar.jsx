import { UtensilsCrossed, ClipboardList, Settings } from "lucide-react";

const views = [
  { id: "menu",   label: "Menu",   icon: UtensilsCrossed },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "admin",  label: "Admin",  icon: Settings },
];

export default function Navbar({ view, setView, cartCount, orderCount, onGoHome }) {
  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 20px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}>
        {/* Logo */}
        <div
        onClick={onGoHome}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
        <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", transition: "transform 0.2s ease",
        }}>🍽️</div>
        <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.3rem", color: "var(--text)", letterSpacing: "-0.02em"
        }}>
            Menu<span style={{ color: "var(--accent)" }}>Flow</span>
        </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "4px" }}>
          {views.map(({ id, label, icon: Icon }) => {
            const isActive = view === id;
            const count = id === "menu" ? cartCount : id === "orders" ? orderCount : 0;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", borderRadius: "10px",
                  border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? "#fff3ef" : "transparent",
                  color: isActive ? "var(--accent)" : "var(--muted)",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={16} />
                <span style={{ display: window.innerWidth < 480 ? "none" : "inline" }}>{label}</span>
                {count > 0 && (
                  <span className="badge">{count > 9 ? "9+" : count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}