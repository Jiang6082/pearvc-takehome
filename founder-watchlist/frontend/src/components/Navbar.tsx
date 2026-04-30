import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-semibold ${isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-white hover:text-slate-950"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#fffdf8]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
          <Link to="/dashboard" className="flex items-center gap-3 text-lg font-semibold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">FW</span>
            Founder Watchlist
          </Link>
          <nav className="flex flex-wrap items-center gap-1 rounded-lg border border-stone-200 bg-stone-100/70 p-1">
            <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/founders" className={navClass}>Founders</NavLink>
            <NavLink to="/updates" className={navClass}>Updates</NavLink>
            <NavLink to="/founders/new" className={navClass}>Add Founder</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">Signed in as</span>
          <span className="font-semibold text-slate-800">{user?.name}</span>
          <button onClick={logout} className="btn-secondary px-3 py-2">Logout</button>
        </div>
      </div>
    </header>
  );
}
