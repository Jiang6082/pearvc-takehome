import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
