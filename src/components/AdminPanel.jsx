import { useState } from "react";
import { Pencil, Trash2, Plus, X, Check, TrendingUp, LayoutGrid, Palette } from "lucide-react";

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"];
const TAGS = ["", "popular", "new", "vegetarian"];
const emptyForm = { name: "", description: "", price: "", category: "Mains", tag: "", available: true, image: "" };

const THEMES = [
  { id: "classic",    name: "Classic",      preview: ["#ff6b35", "#faf9f7", "#1a1814"], accent: "#ff6b35", accentDark: "#e85a25", bg: "#faf9f7", text: "#1a1814" },
  { id: "midnight",   name: "Midnight",     preview: ["#7c6aff", "#0f0f14", "#e8e6ff"], accent: "#7c6aff", accentDark: "#6a58e8", bg: "#0f0f14", text: "#e8e6ff" },
  { id: "forest",     name: "Forest",       preview: ["#2d9e6b", "#f4f9f6", "#1a2e24"], accent: "#2d9e6b", accentDark: "#228c5a", bg: "#f4f9f6", text: "#1a2e24" },
  { id: "rose",       name: "Rose",         preview: ["#e8547a", "#fff8f9", "#2a1018"], accent: "#e8547a", accentDark: "#d43d66", bg: "#fff8f9", text: "#2a1018" },
  { id: "slate",      name: "Slate",        preview: ["#3b82f6", "#f8fafc", "#0f172a"], accent: "#3b82f6", accentDark: "#2563eb", bg: "#f8fafc", text: "#0f172a" },
  { id: "amber",      name: "Amber",        preview: ["#f59e0b", "#fffbf0", "#1c1408"], accent: "#f59e0b", accentDark: "#d97706", bg: "#fffbf0", text: "#1c1408" },
  { id: "charcoal",   name: "Charcoal",     preview: ["#e2e8f0", "#1e2028", "#f1f5f9"], accent: "#e2e8f0", accentDark: "#cbd5e1", bg: "#1e2028", text: "#f1f5f9" },
  { id: "terracotta", name: "Terracotta",   preview: ["#c1694f", "#fdf6f0", "#2c1810"], accent: "#c1694f", accentDark: "#a85840", bg: "#fdf6f0", text: "#2c1810" },
];

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-dark", theme.accentDark);
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--text", theme.text);
  localStorage.setItem("mf-theme", JSON.stringify(theme));
};

// ── Tiny SVG line chart ──────────────────────────────────────────
function RevenueChart({ orders }) {
  const W = 600, H = 180, PAD = { top: 16, right: 16, bottom: 32, left: 48 };

  // Build points: one dot per order, sorted by timestamp
  const sorted = [...orders].sort((a, b) => a.id - b.id);
  if (sorted.length === 0) return (
    <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
      No orders yet — data will appear here.
    </div>
  );

  // Running cumulative revenue
  let cumulative = 0;
  const points = sorted.map((o) => ({ ts: o.id, cum: (cumulative += o.total), single: o.total }));

  const minTs = points[0].ts;
  const maxTs = points[points.length - 1].ts === minTs ? minTs + 1 : points[points.length - 1].ts;
  const maxCum = Math.max(...points.map(p => p.cum));

  const xScale = (ts) => PAD.left + ((ts - minTs) / (maxTs - minTs)) * (W - PAD.left - PAD.right);
  const yScale = (v)  => PAD.top  + (1 - v / (maxCum * 1.1))         * (H - PAD.top  - PAD.bottom);

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.ts).toFixed(1)} ${yScale(p.cum).toFixed(1)}`).join(" ");
  const areaD = `${pathD} L ${xScale(points[points.length-1].ts).toFixed(1)} ${(H - PAD.bottom).toFixed(1)} L ${xScale(points[0].ts).toFixed(1)} ${(H - PAD.bottom).toFixed(1)} Z`;

  // Y-axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ val: maxCum * 1.1 * t, y: yScale(maxCum * 1.1 * t) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(({ val, y }) => (
        <g key={val}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
            stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
          <text x={PAD.left - 8} y={y + 4} textAnchor="end"
            fontSize="10" fill="var(--muted)" fontFamily="var(--font-body)">
            ${val.toFixed(0)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xScale(p.ts)} cy={yScale(p.cum)} r="5"
            fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5" />
        </g>
      ))}

      {/* X-axis baseline */}
      <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom}
        stroke="var(--border)" strokeWidth="1" />
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function AdminPanel({ menu, setMenu, orders = [] }) {
  const [tab, setTab] = useState("menu");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("All");

  // ── Menu handlers ──
  const openAdd  = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, price: item.price.toString() }); setEditId(item.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

  const saveItem = () => {
    if (!form.name.trim() || !form.price) return;
    const item = { ...form, price: parseFloat(form.price) };
    if (editId) setMenu(menu.map((m) => m.id === editId ? { ...item, id: editId } : m));
    else        setMenu([...menu, { ...item, id: Date.now() }]);
    closeForm();
  };

  const deleteItem      = (id) => setMenu(menu.filter((m) => m.id !== id));
  const toggleAvailable = (id) => setMenu(menu.map((m) => m.id === id ? { ...m, available: !m.available } : m));
  const filtered = filterCat === "All" ? menu : menu.filter((m) => m.category === filterCat);

  // ── Sales stats ──
  const today      = new Date().toDateString();
  const todayOrders   = orders.filter(o => new Date(o.id).toDateString() === today);
  const totalRevenue  = orders.reduce((s, o) => s + o.total, 0);
  const todayRevenue  = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders   = orders.length;
  const doneOrders    = orders.filter(o => o.status === "done").length;

  const TABS = [
    { id: "menu",   label: "Menu Editor", icon: LayoutGrid },
    { id: "sales",  label: "Sales",       icon: TrendingUp },
    { id: "themes", label: "Themes",      icon: Palette    },
    ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
          Admin
        </h2>
        <p style={{ color: "var(--muted)", marginTop: "4px", fontSize: "0.9rem" }}>
          Manage your menu and track your revenue
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "32px",
        background: "var(--surface2)", borderRadius: "14px",
        padding: "4px", border: "1px solid var(--border)",
        width: "fit-content",
      }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 20px", borderRadius: "10px", border: "none",
            cursor: "pointer", fontFamily: "var(--font-body)",
            fontSize: "0.875rem", fontWeight: tab === id ? 600 : 400,
            background: tab === id ? "var(--surface)" : "transparent",
            color: tab === id ? "var(--accent)" : "var(--muted)",
            boxShadow: tab === id ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s ease",
          }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── MENU TAB ── */}
      {tab === "menu" && (
        <>
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["All", ...CATEGORIES].map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{
                  padding: "7px 18px", borderRadius: "50px",
                  border: `1px solid ${filterCat === cat ? "var(--accent)" : "var(--border)"}`,
                  background: filterCat === cat ? "var(--accent)" : "var(--surface)",
                  color: filterCat === cat ? "white" : "var(--muted)",
                  fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.875rem",
                  cursor: "pointer", transition: "all 0.2s",
                }}>{cat}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
                  {["Item", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", opacity: item.available ? 1 : 0.5, transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />}
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</p>
                          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.75rem", maxWidth: "220px" }}>{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{item.category}</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>${item.price.toFixed(2)}</span></td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => toggleAvailable(item.id)} className="tag" style={{ background: item.available ? "#f0faf4" : "#fff0f0", color: item.available ? "var(--accent2)" : "#e03e3e", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                        {item.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEdit(item)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "var(--muted)", display: "flex", transition: "all 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                        ><Pencil size={14} /></button>
                        <button onClick={() => deleteItem(item.id)} style={{ background: "#fff0ee", border: "1px solid #ffd5d0", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "#e03e3e", display: "flex", transition: "all 0.2s" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── SALES TAB ── */}
      {tab === "sales" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { label: "Total Revenue",   value: `$${totalRevenue.toFixed(2)}`,  sub: "all time",       icon: "💰", color: "#ff6b35" },
              { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`,  sub: "since midnight", icon: "📈", color: "#2d6a4f" },
              { label: "Total Orders",    value: totalOrders,                    sub: "placed",         icon: "🧾", color: "#7c6aff" },
              { label: "Completed",       value: doneOrders,                     sub: "orders served",  icon: "✅", color: "#d97706" },
            ].map(({ label, value, sub, icon, color }) => (
              <div key={label} className="card" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color, margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {value}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.78rem", margin: "4px 0 0" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                  Cumulative Revenue
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "4px 0 0" }}>
                  Running total across all orders
                </p>
              </div>
              {orders.length > 0 && (
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)" }}>
                  ${totalRevenue.toFixed(2)}
                </span>
              )}
            </div>
            <RevenueChart orders={orders} />
          </div>

          {/* Recent Orders */}
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Recent Orders</h3>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{orders.length} total</span>
            </div>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px", fontSize: "0.9rem" }}>
                No orders yet. They'll show up here once customers start ordering.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                    {["Table", "Items", "Total", "Status", "Time"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...orders].reverse().map((order, i) => (
                    <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? "1px solid var(--border)" : "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface2)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "0.875rem" }}>{order.table}</td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)", fontSize: "0.82rem" }}>
                        {order.items.map(i => `${i.qty}× ${i.name}`).join(", ")}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)" }}>${order.total.toFixed(2)}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 700,
                          background: order.status === "done" ? "#f0faf4" : order.status === "cooking" ? "#fffbeb" : "#fff3ef",
                          color: order.status === "done" ? "#2d6a4f" : order.status === "cooking" ? "#d97706" : "#ff6b35",
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)", fontSize: "0.78rem" }}>
                        {new Date(order.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── THEMES TAB ── */}
      {tab === "themes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Header */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>
              Color Themes
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
              Choose a palette to instantly restyle the entire app. Changes apply live and persist across sessions.
            </p>
          </div>

          {/* Theme Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {THEMES.map((theme) => {
              const isActive = localStorage.getItem("mf-theme")
                ? JSON.parse(localStorage.getItem("mf-theme")).id === theme.id
                : theme.id === "classic";
              return (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  style={{
                    border: `2px solid ${isActive ? theme.accent : "var(--border)"}`,
                    borderRadius: "16px", padding: "20px",
                    background: theme.bg,
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.25s ease",
                    boxShadow: isActive ? `0 0 0 4px ${theme.accent}30` : "var(--shadow-sm)",
                    transform: isActive ? "translateY(-3px)" : "translateY(0)",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Active checkmark */}
                  {isActive && (
                    <div style={{
                      position: "absolute", top: "12px", right: "12px",
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: theme.accent, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={12} color="white" strokeWidth={3} />
                    </div>
                  )}

                  {/* Color swatches */}
                  <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                    {theme.preview.map((color, i) => (
                      <div key={i} style={{
                        width: i === 0 ? "32px" : "20px",
                        height: "32px", borderRadius: "8px",
                        background: color,
                        border: "1px solid rgba(0,0,0,0.08)",
                        transition: "transform 0.2s",
                      }} />
                    ))}
                  </div>

                  {/* Theme name */}
                  <p style={{
                    margin: 0, fontFamily: "var(--font-display)",
                    fontSize: "0.95rem", fontWeight: 700,
                    color: theme.text,
                  }}>
                    {theme.name}
                  </p>

                  {/* Accent hex */}
                  <p style={{
                    margin: "4px 0 0", fontSize: "0.72rem",
                    color: theme.accent, fontFamily: "monospace",
                    letterSpacing: "0.06em",
                  }}>
                    {theme.accent}
                  </p>

                  {/* Mini preview bar */}
                  <div style={{
                    marginTop: "14px", height: "4px", borderRadius: "2px",
                    background: `linear-gradient(to right, ${theme.accent}, ${theme.accentDark})`,
                  }} />
                </button>
              );
            })}
          </div>

          {/* Reset note */}
          <p style={{ color: "var(--muted)", fontSize: "0.78rem", textAlign: "center" }}>
            Theme changes apply instantly across the entire app including the customer menu and staff views.
          </p>
        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      {showForm && (
        <>
          <div onClick={closeForm} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 99, backdropFilter: "blur(2px)" }} />
          <div className="animate-fade-up" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "var(--surface)", borderRadius: "20px", border: "1px solid var(--border)", padding: "32px", zIndex: 100, width: "min(480px, 90vw)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                {editId ? "Edit Item" : "Add New Item"}
              </h3>
              <button onClick={closeForm} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input className="input-field" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ resize: "none" }} />
              <div style={{ display: "flex", gap: "12px" }}>
                <input className="input-field" placeholder="Price (e.g. 12.99)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input className="input-field" placeholder="Image URL (paste an Unsplash or direct image link)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                {form.image && (
                  <img src={form.image} alt="preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--border)" }}
                    onError={(e) => e.target.style.display = "none"} />
                )}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <select className="input-field" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                  {TAGS.map((t) => <option key={t} value={t}>{t || "No tag"}</option>)}
                </select>
                <button onClick={() => setForm({ ...form, available: !form.available })} style={{ flex: 1, borderRadius: "10px", border: "1px solid var(--border)", background: form.available ? "#f0faf4" : "#fff0f0", color: form.available ? "var(--accent2)" : "#e03e3e", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s", fontFamily: "var(--font-body)" }}>
                  {form.available ? "✓ Available" : "✗ Unavailable"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button className="btn-ghost" onClick={closeForm} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={saveItem} disabled={!form.name.trim() || !form.price} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Check size={16} /> {editId ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}