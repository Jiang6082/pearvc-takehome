import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FounderListPage from "./pages/FounderListPage";
import FounderDetailPage from "./pages/FounderDetailPage";
import AddFounderPage from "./pages/AddFounderPage";
import UpdatesFeedPage from "./pages/UpdatesFeedPage";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-slate-600">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/founders" element={<FounderListPage />} />
        <Route path="/founders/new" element={<AddFounderPage />} />
        <Route path="/founders/:id" element={<FounderDetailPage />} />
        <Route path="/updates" element={<UpdatesFeedPage />} />
      </Route>
    </Routes>
  );
}
