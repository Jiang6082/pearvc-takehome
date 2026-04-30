import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import FiltersBar from "../components/FiltersBar";
import FounderTable from "../components/FounderTable";
import { Founder, Tag } from "../types";

export default function FounderListPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filters, setFilters] = useState<Record<string, string | boolean>>({ sortBy: "recentUpdate", sortOrder: "desc" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tags").then((res) => setTags(res.data));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== false));
    setLoading(true);
    api.get("/founders", { params }).then((res) => setFounders(res.data)).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Founders</h1>
          <p className="text-sm text-slate-600">Filter the watchlist as it grows.</p>
        </div>
        <Link to="/founders/new" className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">Add Founder</Link>
      </div>
      <FiltersBar filters={filters} tags={tags} onChange={setFilters} />
      {loading ? <p className="text-sm text-slate-600">Loading founders...</p> : <FounderTable founders={founders} />}
    </div>
  );
}
