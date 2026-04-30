import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-lg font-semibold text-slate-950">Founder Watchlist</Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/founders" className={navClass}>Founders</NavLink>
            <NavLink to="/updates" className={navClass}>Updates</NavLink>
            <NavLink to="/founders/new" className={navClass}>Add Founder</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">{user?.name}</span>
          <button onClick={logout} className="rounded border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">Logout</button>
        </div>
      </div>
    </header>
  );
}
