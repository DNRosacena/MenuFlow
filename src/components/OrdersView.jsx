import { useState } from "react";
import { Clock, CheckCircle, ChefHat, Trash2 } from "lucide-react";

const STATUS = {
  pending:  { label: "Pending",    color: "#ff6b35", bg: "#fff3ef", icon: Clock },
  cooking:  { label: "Cooking",    color: "#d97706", bg: "#fffbeb", icon: ChefHat },
  done:     { label: "Done",       color: "#2d6a4f", bg: "#f0faf4", icon: CheckCircle },
};

export default function OrdersView({ orders, onUpdateStatus, onDeleteOrder }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
          Order Queue
        </h2>
        <p style={{ color: "var(--muted)", marginTop: "4px", fontSize: "0.9rem" }}>
          {orders.filter(o => o.status !== "done").length} active · {orders.filter(o => o.status === "done").length} completed
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["all", "pending", "cooking", "done"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 18px", borderRadius: "50px",
              border: `1px solid ${filter === s ? "var(--accent)" : "var(--border)"}`,
              background: filter === s ? "#fff3ef" : "var(--surface)",
              color: filter === s ? "var(--accent)" : "var(--muted)",
              fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.875rem",
              cursor: "pointer", transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {s === "all" ? `All (${orders.length})` : `${STATUS[s]?.label} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          color: "var(--muted)", fontSize: "0.95rem"
        }}>
          <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🍽️</p>
          <p>No {filter === "all" ? "" : filter} orders yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filtered.map((order) => {
            const status = STATUS[order.status];
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="card animate-fade-up" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Order Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                      {order.table}
                    </h3>
                    <p style={{ color: "var(--muted)", fontSize: "0.78rem", margin: "2px 0 0" }}>
                      {timeAgo(order.id)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="tag" style={{ background: status.bg, color: status.color, display: "flex", alignItems: "center", gap: "4px" }}>
                      <StatusIcon size={10} />
                      {status.label}
                    </span>
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", opacity: 0.5, transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text)" }}>
                        <span style={{ fontWeight: 600, color: "var(--accent)" }}>{item.qty}×</span> {item.name}
                      </span>
                      <span style={{ color: "var(--muted)" }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Status Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {order.status === "pending" && (
                    <button className="btn-ghost" onClick={() => onUpdateStatus(order.id, "cooking")} style={{ flex: 1, fontSize: "0.8rem" }}>
                      🍳 Start Cooking
                    </button>
                  )}
                  {order.status === "cooking" && (
                    <button className="btn-success" onClick={() => onUpdateStatus(order.id, "done")} style={{ flex: 1, fontSize: "0.8rem", padding: "8px" }}>
                      ✅ Mark as Done
                    </button>
                  )}
                  {order.status === "done" && (
                    <span style={{ flex: 1, textAlign: "center", fontSize: "0.8rem", color: "var(--accent2)", fontWeight: 600 }}>
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}