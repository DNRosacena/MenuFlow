import { useState } from "react";
import { Plus, Minus, ShoppingBag, X, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

const TAG_STYLES = {
  popular:    { bg: "#ff6b35", color: "#ffffff" },
  new:        { bg: "#2d6a4f", color: "#ffffff" },
  vegetarian: { bg: "#2d6a4f", color: "#ffffff" },
};

export default function MenuView({ menu, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [placed, setPlaced] = useState(false);

  const categories = ["All", ...new Set(menu.map((i) => i.category))];
  const filtered = activeCategory === "All"
    ? menu.filter((i) => i.available)
    : menu.filter((i) => i.category === activeCategory && i.available);

  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { ...item, qty }];
    });
  };

  const removeOne = (id) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing?.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const getQty = (id) => cart.find((c) => c.id === id)?.qty || 0;
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const placeOrder = () => {
    if (!tableNumber.trim() || cart.length === 0) return;
    onPlaceOrder({ items: cart, table: `Table ${tableNumber}`, total, id: Date.now() });
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#ff6b35", "#ffffff", "#2d6a4f"] });
    setCart([]);
    setTableNumber("");
    setPlaced(true);
    setCartOpen(false);
    setTimeout(() => setPlaced(false), 4000);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

      {/* Header */}
      <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 6px" }}>
            What would you like?
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>
            Our Menu
          </h2>
        </div>

        {/* Cart Button */}
        <button onClick={() => setCartOpen(true)} style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: cartCount > 0 ? "var(--accent)" : "var(--surface)",
          color: cartCount > 0 ? "white" : "var(--muted)",
          border: `1px solid ${cartCount > 0 ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "50px", padding: "12px 24px",
          cursor: "pointer", fontFamily: "var(--font-body)",
          fontWeight: 600, fontSize: "0.875rem",
          transition: "all 0.3s ease",
          boxShadow: cartCount > 0 ? "0 4px 20px rgba(255,107,53,0.35)" : "none",
        }}>
          <ShoppingBag size={18} />
          {cartCount > 0 ? (
            <span>{cartCount} item{cartCount > 1 ? "s" : ""} · <strong>${total.toFixed(2)}</strong></span>
          ) : <span>Cart</span>}
        </button>
      </div>

      {/* Success Toast */}
      {placed && (
        <div className="animate-slide-in" style={{
          background: "#f0faf4", border: "1px solid #c8e6d5",
          borderRadius: "14px", padding: "16px 22px",
          marginBottom: "28px", color: "var(--accent2)",
          fontWeight: 600, display: "flex", alignItems: "center", gap: "12px",
          boxShadow: "0 4px 16px rgba(45,106,79,0.15)"
        }}>
          ✅ Order placed! Your food is being prepared. Sit back and relax.
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "8px 20px", borderRadius: "50px",
            border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
            background: activeCategory === cat ? "var(--accent)" : "var(--surface)",
            color: activeCategory === cat ? "white" : "var(--muted)",
            fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.875rem",
            cursor: "pointer", transition: "all 0.2s ease",
            boxShadow: activeCategory === cat ? "0 4px 14px rgba(255,107,53,0.3)" : "none",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px"
      }}>
        {filtered.map((item) => {
          const qty = getQty(item.id);
          return (
            <div
            key={item.id}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
                borderRadius: "18px", overflow: "hidden",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                transition: "all 0.3s ease",
                boxShadow: hoveredItem === item.id ? "var(--shadow-lg)" : "var(--shadow-sm)",
                transform: hoveredItem === item.id ? "translateY(-6px)" : "translateY(0)",
                position: "relative",
            }}
            >
            {/* Food Image */}
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                <img
                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.4s ease",
                    transform: hoveredItem === item.id ? "scale(1.06)" : "scale(1)"
                }}
                />
                {item.tag && TAG_STYLES[item.tag] && (
                <span style={{
                    position: "absolute", top: "12px", left: "12px",
                    background: TAG_STYLES[item.tag].bg,
                    color: TAG_STYLES[item.tag].color,
                    padding: "4px 10px", borderRadius: "50px",
                    fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                    {item.tag}
                </span>
                )}
            </div>

            {/* Item Info */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
                    {item.name}
                </h3>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--accent)", flexShrink: 0 }}>
                    ${item.price.toFixed(2)}
                </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                {item.description}
                </p>

                {/* Inline Add to Cart */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                {qty === 0 ? (
                    <button
                    onClick={() => addToCart(item)}
                    style={{
                        background: "var(--accent)", color: "white",
                        border: "none", borderRadius: "50px",
                        padding: "8px 20px", cursor: "pointer",
                        fontFamily: "var(--font-body)", fontWeight: 600,
                        fontSize: "0.82rem", transition: "all 0.2s ease",
                        boxShadow: "0 4px 14px rgba(255,107,53,0.3)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                    + Add
                    </button>
                ) : (
                    <div style={{
                    display: "flex", alignItems: "center", gap: "0",
                    background: "var(--surface2)", borderRadius: "50px",
                    border: "1px solid var(--border)", overflow: "hidden",
                    }}>
                    <button
                        onClick={() => removeOne(item.id)}
                        style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "7px 14px", color: "var(--accent)",
                        fontWeight: 700, fontSize: "1.1rem", transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fff3ef"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        −
                    </button>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", minWidth: "24px", textAlign: "center", color: "var(--text)" }}>
                        {qty}
                    </span>
                    <button
                        onClick={() => addToCart(item)}
                        style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: "7px 14px", color: "var(--accent)",
                        fontWeight: 700, fontSize: "1.1rem", transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fff3ef"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                    >
                        +
                    </button>
                    </div>
                )}
                </div>
            </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 99, backdropFilter: "blur(3px)" }} />
          <div className="animate-slide-in" style={{
            position: "fixed", top: 0, right: 0, height: "100vh",
            width: "min(400px, 100vw)",
            background: "var(--surface)", borderLeft: "1px solid var(--border)",
            zIndex: 100, display: "flex", flexDirection: "column",
            boxShadow: "-8px 0 48px rgba(0,0,0,0.15)",
          }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Your Order</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.8rem" }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {cart.length === 0 ? (
                <p style={{ color: "var(--muted)", textAlign: "center", marginTop: "60px", fontSize: "0.9rem" }}>
                  Your cart is empty.<br />Browse the menu and tap an item to add it!
                </p>
              ) : cart.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img src={item.image} alt={item.name} style={{ width: "54px", height: "54px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem" }}>{item.name}</p>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.78rem" }}>${item.price.toFixed(2)} each</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => removeOne(item.id)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border)", background: "var(--surface2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Minus size={11} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", background: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <Plus size={11} />
                    </button>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem", minWidth: "52px", textAlign: "right", color: "var(--accent)" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                    <span style={{
                        padding: "10px 14px", fontFamily: "var(--font-body)",
                        fontSize: "0.875rem", color: "var(--muted)",
                        borderRight: "1px solid var(--border)", background: "var(--surface)",
                        whiteSpace: "nowrap", userSelect: "none",
                    }}>
                        Table
                    </span>
                    <input
                        type="number"
                        min="1"
                        placeholder="4"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        style={{
                        flex: 1, background: "transparent", border: "none",
                        padding: "10px 14px", color: "var(--text)",
                        fontFamily: "var(--font-body)", fontSize: "0.875rem",
                        outline: "none",
                        }}
                    />
                    </div>
                <button className="btn-primary" onClick={placeOrder} disabled={!tableNumber.trim()} style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "1rem" }}>
                  Place Order <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}