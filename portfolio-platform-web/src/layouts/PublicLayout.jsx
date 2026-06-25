import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useVisitorTracking } from "../hooks/useVisitorTracking";

export default function PublicLayout() {
  useVisitorTracking();

  return (
    <div className="public-layout">
      <Navbar />
      <div style={{ paddingTop: "var(--navbar-height)" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
