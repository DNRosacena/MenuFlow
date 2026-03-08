import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/NavBar";
import MenuView from "./components/MenuView";
import OrdersView from "./components/OrdersView";
import AdminPanel from "./components/AdminPanel";
import { defaultMenu } from "./data/defaultMenu";
import "./App.css";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState("menu");
  const [menu, setMenu] = useState(defaultMenu);
  const [orders, setOrders] = useState([]);

  const handleEnter = () => setShowLanding(false);

  const handlePlaceOrder = (order) => {
    setOrders((prev) => [...prev, { ...order, status: "pending" }]);
  };

  const handleUpdateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const handleDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const orderCount = orders.filter((o) => o.status !== "done").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {showLanding && <LandingPage onEnter={handleEnter} />}

      {!showLanding && (
        <>
          <Navbar view={view} setView={setView} cartCount={0} orderCount={orderCount} onGoHome={() => setShowLanding(true)} />
          {view === "menu"   && <MenuView menu={menu} onPlaceOrder={handlePlaceOrder} />}
          {view === "orders" && <OrdersView orders={orders} onUpdateStatus={handleUpdateStatus} onDeleteOrder={handleDeleteOrder} />}
          {view === "admin"  && <AdminPanel menu={menu} setMenu={setMenu} orders={orders} />}
        </>
      )}
    </div>
  );
}