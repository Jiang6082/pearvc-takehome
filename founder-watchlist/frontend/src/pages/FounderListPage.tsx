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
      <div className="page-header">
        <div>
          <p className="eyebrow">Watchlist</p>
          <h1 className="page-title">Founders</h1>
          <p className="page-subtitle">Filter the watchlist as it grows and spot the strongest next conversation.</p>
        </div>
        <Link to="/founders/new" className="btn-primary">Add Founder</Link>
      </div>
      <FiltersBar filters={filters} tags={tags} onChange={setFilters} />
      {loading ? <p className="text-sm text-slate-600">Loading founders...</p> : <FounderTable founders={founders} />}
    </div>
  );
}
