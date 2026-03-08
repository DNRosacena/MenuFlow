export default function LandingPage({ onEnter }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Full-screen background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&h=1200&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "scale(1.05)",
        animation: "slowZoom 12s ease-in-out infinite alternate",
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(10,8,5,0.3) 0%, rgba(10,8,5,0.65) 60%, rgba(10,8,5,0.85) 100%)",
      }} />

      {/* Grain texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        padding: "0 24px", gap: "32px",
        animation: "fadeUp 1s ease forwards",
      }}>
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          opacity: 0.8, animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          <div style={{ height: "1px", width: "40px", background: "rgba(255,255,255,0.5)" }} />
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "0.7rem",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
          }}>
            Fine Dining Experience
          </span>
          <div style={{ height: "1px", width: "40px", background: "rgba(255,255,255,0.5)" }} />
        </div>

        {/* Main Title */}
        <div style={{ animation: "fadeUp 0.8s ease 0.35s both" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 800, letterSpacing: "-0.03em",
            lineHeight: 0.95, color: "#ffffff",
            margin: 0, textShadow: "0 4px 40px rgba(0,0,0,0.4)",
          }}>
            Menu<span style={{ color: "var(--accent)" }}>Flow</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,255,255,0.65)", marginTop: "16px",
            fontWeight: 300, letterSpacing: "0.04em",
          }}>
            Crafted with passion. Served with care.
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ animation: "fadeUp 0.8s ease 0.5s both", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <button
            onClick={onEnter}
            style={{
              background: "var(--accent)",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "0.02em",
              padding: "18px 52px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 40px rgba(255,107,53,0.5)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 16px 50px rgba(255,107,53,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(255,107,53,0.5)";
            }}
          >
            Order Now
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "-120px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "bounce 2s ease-in-out infinite",
          opacity: 0.5,
        }}>
          <div style={{ width: "1px", height: "50px", background: "rgba(255,255,255,0.4)" }} />
        </div>
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.12); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}